#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const skillDir = dirname(dirname(fileURLToPath(import.meta.url)));
const templateDir = join(skillDir, "assets", "module-template");
const projectRoot = process.cwd();

process.on("uncaughtException", (error) => {
  console.error(`Erro: ${error.message}`);
  process.exit(1);
});

function parseArgs(argv) {
  const args = {
    apps: [],
    skipInstall: false,
    skipBuild: false,
    skipTest: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--module") {
      args.module = argv[++index];
    } else if (arg === "--namespace") {
      args.namespace = argv[++index];
    } else if (arg === "--app") {
      args.apps.push(argv[++index]);
    } else if (arg === "--apps") {
      args.apps.push(...argv[++index].split(","));
    } else if (arg === "--with-business-module" || arg === "--with-business") {
      continue;
    } else if (arg === "--skip-install") {
      args.skipInstall = true;
    } else if (arg === "--skip-build") {
      args.skipBuild = true;
    } else if (arg === "--skip-test") {
      args.skipTest = true;
    } else {
      throw new Error(`Argumento desconhecido: ${arg}`);
    }
  }

  return args;
}

function toPascalCase(name) {
  const identifier = name
    .split("-")
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join("");

  return /^[A-Za-z_$]/.test(identifier) ? identifier : `Module${identifier}`;
}

function slugifyModuleName(name) {
  return name
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function normalizeNamespace(namespace) {
  return namespace.trim().replace(/\/+$/g, "");
}

function assertPackageNamespace(namespace) {
  if (!namespace) {
    throw new Error("Informe o namespace do pacote com --namespace, por exemplo: --namespace @meu-projeto");
  }

  if (!namespace.startsWith("@") || namespace.includes("/")) {
    throw new Error("O namespace deve ter o formato @nome, por exemplo: @meu-projeto");
  }
}

function normalizeApps(apps) {
  const normalizedApps = apps.map((app) => app.trim().toLowerCase()).filter(Boolean);
  const invalidApp = normalizedApps.find((app) => !["frontend", "backend"].includes(app));

  if (invalidApp) {
    throw new Error("O app deve ser frontend ou backend, por exemplo: --app frontend");
  }

  return [...new Set(normalizedApps)];
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function assertFile(path) {
  if (!existsSync(path)) {
    throw new Error(`Arquivo esperado nao encontrado: ${relative(projectRoot, path)}`);
  }
}

function copyTemplate(fromDir, toDir, replacements) {
  mkdirSync(toDir, { recursive: true });

  for (const entry of readdirSync(fromDir)) {
    const source = join(fromDir, entry);
    const target = join(toDir, entry);
    const sourceStat = statSync(source);

    if (sourceStat.isDirectory()) {
      copyTemplate(source, target, replacements);
      continue;
    }

    copyFileSync(source, target);
    const raw = readFileSync(target, "utf8");
    const rendered = Object.entries(replacements).reduce(
      (content, [key, value]) => content.replaceAll(key, value),
      raw,
    );
    writeFileSync(target, rendered);
  }
}

function addDependency(packageJsonPath, dependencyName) {
  const json = readJson(packageJsonPath);
  json.dependencies = json.dependencies ?? {};
  json.dependencies[dependencyName] = "*";
  writeJson(packageJsonPath, json);
}

function ensureRootPackage(packageJsonPath) {
  const json = readJson(packageJsonPath);
  const workspaces = Array.isArray(json.workspaces) ? json.workspaces : [];

  if (!workspaces.includes("modules/*")) {
    workspaces.push("modules/*");
    json.workspaces = workspaces;
  }

  const currentTsNodeVersion = json.devDependencies?.["ts-node"] ?? json.dependencies?.["ts-node"] ?? "latest";
  json.devDependencies = json.devDependencies ?? {};
  json.devDependencies["ts-node"] = currentTsNodeVersion;

  if (json.dependencies?.["ts-node"]) {
    delete json.dependencies["ts-node"];
    if (Object.keys(json.dependencies).length === 0) {
      delete json.dependencies;
    }
  }

  writeJson(packageJsonPath, json);
}

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    stdio: "inherit",
    shell: false,
  });

  if (result.status !== 0) {
    throw new Error(`Comando falhou: ${command} ${args.join(" ")}`);
  }
}

function writeFile(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}

function insertAfterImports(source, importLine) {
  if (source.includes(importLine)) {
    return source;
  }

  const importMatches = [...source.matchAll(/^import .+;$/gm)];
  if (importMatches.length === 0) {
    return `${importLine}\n\n${source}`;
  }

  const lastImport = importMatches.at(-1);
  const insertAt = lastImport.index + lastImport[0].length;
  return `${source.slice(0, insertAt)}\n${importLine}${source.slice(insertAt)}`;
}

function assertPathDoesNotExist(path) {
  if (existsSync(path)) {
    throw new Error(`O modulo ja existe: ${relative(projectRoot, path)}`);
  }
}

function createFrontendModule(moduleName) {
  const appDir = join(projectRoot, "apps", "frontend");
  const srcDir = join(appDir, "src");
  const routeDir = join(srcDir, "app", "(private)", moduleName);
  const routePagePath = join(routeDir, "page.tsx");
  const pascalName = toPascalCase(moduleName);
  const pageComponentName = `${pascalName}Page`;

  assertFile(join(appDir, "package.json"));
  assertPathDoesNotExist(routeDir);

  writeFile(
    routePagePath,
    `import { ${pageComponentName} } from "../../../../../../modules/${moduleName}/pages/${moduleName}.page";\n\nexport default function ${pascalName}RoutePage() {\n  return <${pageComponentName} />;\n}\n`,
  );

  return `apps/frontend/src/app/(private)/${moduleName}/page.tsx`;
}

function createBackendModule(moduleName, businessPackageName) {
  const appDir = join(projectRoot, "apps", "backend");
  const srcDir = join(appDir, "src");
  const moduleDir = join(srcDir, "modules", moduleName);
  const appModulePath = join(srcDir, "app.module.ts");
  const pascalName = toPascalCase(moduleName);
  const moduleClassName = `${pascalName}Module`;
  const controllerClassName = `${pascalName}Controller`;

  assertFile(join(appDir, "package.json"));
  assertFile(appModulePath);

  assertPathDoesNotExist(moduleDir);

  mkdirSync(moduleDir, { recursive: true });
  writeFile(
    join(moduleDir, `${moduleName}.controller.ts`),
    businessPackageName
      ? `import { Controller, Get } from '@nestjs/common';\nimport { somar } from '${businessPackageName}';\n\n@Controller('${moduleName}')\nexport class ${controllerClassName} {\n  @Get()\n  getMessage(): { message: string; result: number } {\n    return {\n      message: 'Modulo ${moduleName} ativo',\n      result: somar(2, 4),\n    };\n  }\n}\n`
      : `import { Controller, Get } from '@nestjs/common';\n\n@Controller('${moduleName}')\nexport class ${controllerClassName} {\n  @Get()\n  getMessage(): { message: string } {\n    return { message: 'Modulo ${moduleName} ativo' };\n  }\n}\n`,
  );
  writeFile(
    join(moduleDir, `${moduleName}.module.ts`),
    `import { Module } from '@nestjs/common';\nimport { ${controllerClassName} } from './${moduleName}.controller';\n\n@Module({\n  controllers: [${controllerClassName}],\n})\nexport class ${moduleClassName} {}\n`,
  );
  writeFile(join(moduleDir, "index.ts"), `export * from './${moduleName}.module';\n`);

  const importLine = `import { ${moduleClassName} } from './modules/${moduleName}';`;
  let appModuleSource = readFileSync(appModulePath, "utf8");
  appModuleSource = insertAfterImports(appModuleSource, importLine);

  if (!appModuleSource.includes(`${moduleClassName},`)) {
    if (/imports:\s*\[\s*\]/.test(appModuleSource)) {
      appModuleSource = appModuleSource.replace(/imports:\s*\[\s*\]/, `imports: [\n    ${moduleClassName},\n  ]`);
    } else if (/imports:\s*\[/.test(appModuleSource)) {
      appModuleSource = appModuleSource.replace(/imports:\s*\[/, `imports: [\n    ${moduleClassName},`);
    } else {
      throw new Error("Nao foi possivel registrar o modulo em apps/backend/src/app.module.ts");
    }
  }

  writeFileSync(appModulePath, appModuleSource);

  return `apps/backend/src/modules/${moduleName}`;
}

function createSharedModule(moduleName, namespace) {
  assertPackageNamespace(namespace);

  const packageName = `${namespace}/${moduleName}`;
  const modulesDir = join(projectRoot, "modules");
  const moduleDir = join(modulesDir, moduleName);
  const rootPackageJsonPath = join(projectRoot, "package.json");
  const frontendPackageJsonPath = join(projectRoot, "apps", "frontend", "package.json");
  const backendPackageJsonPath = join(projectRoot, "apps", "backend", "package.json");

  assertFile(rootPackageJsonPath);
  assertFile(frontendPackageJsonPath);
  assertFile(backendPackageJsonPath);

  assertPathDoesNotExist(moduleDir);

  mkdirSync(modulesDir, { recursive: true });
  copyTemplate(templateDir, moduleDir, {
    __PACKAGE_NAME__: packageName,
    __PACKAGE_NAMESPACE__: namespace,
    __MODULE_NAME__: moduleName,
  });

  createFrontendFilesInSharedModule(moduleName, moduleDir);

  ensureRootPackage(rootPackageJsonPath);
  addDependency(frontendPackageJsonPath, packageName);
  addDependency(backendPackageJsonPath, packageName);

  return `modules/${moduleName}`;
}

function createFrontendFilesInSharedModule(moduleName, moduleDir) {
  const pascalName = toPascalCase(moduleName);
  const componentName = `${pascalName}Component`;
  const pageComponentName = `${pascalName}Page`;

  writeFile(
    join(moduleDir, "components", `${moduleName}.component.tsx`),
    `export function ${componentName}() {\n  return (\n    <section>\n      <h1>${pascalName}</h1>\n      <p>Modulo ${moduleName} ativo.</p>\n    </section>\n  );\n}\n`,
  );

  writeFile(
    join(moduleDir, "pages", `${moduleName}.page.tsx`),
    `import { ${componentName} } from "../components/${moduleName}.component";\n\nexport function ${pageComponentName}() {\n  return <${componentName} />;\n}\n`,
  );
}

const args = parseArgs(process.argv.slice(2));
const moduleName = slugifyModuleName(args.module ?? "");
const namespace = normalizeNamespace(args.namespace ?? "");
const apps = normalizeApps(args.apps);

if (!moduleName) {
  throw new Error("Informe o nome do modulo com --module, por exemplo: --module auth");
}

assertPackageNamespace(namespace);

let createdPaths = [];
const businessPackageName = `${namespace}/${moduleName}`;

assertPathDoesNotExist(join(projectRoot, "modules", moduleName));

if (apps.includes("frontend")) {
  assertPathDoesNotExist(join(projectRoot, "apps", "frontend", "src", "app", "(private)", moduleName));
}

if (apps.includes("backend")) {
  assertPathDoesNotExist(join(projectRoot, "apps", "backend", "src", "modules", moduleName));
}

createdPaths.push(createSharedModule(moduleName, namespace));

if (apps.includes("frontend")) {
  createdPaths.push(createFrontendModule(moduleName));
}

if (apps.includes("backend")) {
  createdPaths.push(createBackendModule(moduleName, businessPackageName));
}

if (!args.skipInstall) {
  run("npm", ["install"]);
}

if (!args.skipBuild) {
  run("npm", ["run", "build"]);
}

if (!args.skipTest) {
  run("npm", ["test", "-w", businessPackageName]);
}

console.log(`Modulo criado com sucesso: ${createdPaths.join(", ")}`);
