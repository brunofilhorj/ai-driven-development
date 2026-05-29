---
name: config-new-module
description: Cria um novo modulo TypeScript em monorepos com apps/frontend, apps/backend, modules/* e packages/*. Use quando o usuario pedir para adicionar, configurar ou gerar um modulo de negocio em modules/* ou um modulo compartilhado em packages/*.
---

# Config New Module

## Regras

- Responder e registrar decisoes em portugues do Brasil.
- Exigir o nome do modulo. Normalizar o nome para kebab-case antes de criar arquivos.
- Exigir sempre o namespace do pacote. Nao executar esta skill se o namespace nao for informado.
- Criar modulos de negocio em `modules/<nome-do-modulo>/`.
- Criar modulos compartilhados globais em `packages/<nome-do-modulo>/` quando o usuario pedir um modulo compartilhado entre frontend, backend e demais modulos, usando a flag `--shared`.
- A criacao em `apps/frontend` e `apps/backend` e opcional. Quando o usuario pedir integracao em app, aceitar `frontend`, `backend` ou ambos ao mesmo tempo.
- Modulos compartilhados em `packages/*` nao criam rota no frontend nem modulo local no backend; eles devem ser consumidos como dependencia.
- Para criar em ambos os apps, usar `--app frontend --app backend` ou `--apps frontend,backend`.
- A flag `--with-business-module` e mantida apenas por compatibilidade; o pacote em `modules/*` ja e obrigatorio.
- Para pacote reutilizavel:
  - Criar `modules/` caso a pasta ainda nao exista.
  - Criar `modules/<nome-do-modulo>/` com os arquivos deterministicos de `assets/module-template/`.
  - Criar a pagina principal do modulo em `modules/<nome-do-modulo>/pages/<nome-do-modulo>.page.tsx`.
  - Criar o componente principal do modulo em `modules/<nome-do-modulo>/components/<nome-do-modulo>.component.tsx`.
  - Atualizar `apps/frontend/package.json` e `apps/backend/package.json` adicionando a dependencia `<namespace>/<nome-do-modulo>: "*"`.
  - Garantir `ts-node` em `devDependencies` do `package.json` da raiz. Se `ts-node` estiver em `dependencies`, mover para `devDependencies`.
  - Garantir `"modules/*"` e `"packages/*"` em `workspaces` do `package.json` da raiz.
  - Executar instalacao das dependencias, build do projeto e testes do modulo criado.
- Para modulo compartilhado em `packages/*`:
  - Criar `packages/` caso a pasta ainda nao exista.
  - Criar `packages/<nome-do-modulo>/` com os arquivos deterministicos de `assets/module-template/`.
  - Atualizar `apps/frontend/package.json`, `apps/backend/package.json` e todos os `modules/*/package.json` adicionando a dependencia `<namespace>/<nome-do-modulo>: "*"`.
  - Garantir `ts-node` em `devDependencies` do `package.json` da raiz. Se `ts-node` estiver em `dependencies`, mover para `devDependencies`.
  - Garantir `"modules/*"` e `"packages/*"` em `workspaces` do `package.json` da raiz.
  - Executar instalacao das dependencias, build do projeto e testes do pacote criado.
- Para integracao no frontend:
  - Criar a rota privada do modulo em `apps/frontend/src/app/(private)/<nome-do-modulo>/page.tsx`.
  - A rota deve renderizar a pagina principal criada em `modules/<nome-do-modulo>/pages/<nome-do-modulo>.page.tsx`.
  - Nao criar modulo local em `apps/frontend/src/modules`.
  - Nao criar testes especificos para essa rota.
- Para integracao no backend:
  - Criar `apps/backend/src/modules/<nome-do-modulo>/`.
  - Criar a definicao do modulo NestJS, o controller e o `index.ts`.
  - Fazer o controller chamar o pacote de negocio criado em `modules/<nome-do-modulo>/`.
  - Registrar o modulo em `apps/backend/src/app.module.ts`.
  - Nao criar testes para o modulo local dentro do app.
- Para pacote + frontend + backend:
  - Criar primeiro o pacote reutilizavel em `modules/<nome-do-modulo>/`.
  - Criar a rota privada em `apps/frontend/src/app/(private)/<nome-do-modulo>/page.tsx`.
  - Criar o modulo local em `apps/backend/src/modules/<nome-do-modulo>/`.
  - Atualizar as dependencias dos apps com `<namespace>/<nome-do-modulo>: "*"`.
  - Executar instalacao das dependencias, build do projeto e testes do pacote de negocio criado.

## Execucao Padrao

### Modulo compartilhado global em `packages/*`

Use o script da skill a partir da raiz do projeto:

```bash
node .agents/skills/config-new-module/scripts/create-module.mjs --module <nome-do-modulo> --namespace <namespace> --shared
```

Exemplo:

```bash
node .agents/skills/config-new-module/scripts/create-module.mjs --module shared --namespace @meu-projeto --shared
```

O script:

1. Valida `--namespace`, `--module` e `--shared`.
2. Copia os assets para `packages/<nome-do-modulo>/`.
3. Substitui `__PACKAGE_NAME__`, `__PACKAGE_NAMESPACE__` e `__MODULE_NAME__` nos arquivos copiados.
4. Atualiza os `package.json` da raiz, frontend, backend e todos os modulos em `modules/*`.
5. Executa `npm install`.
6. Executa `npm run build`.
7. Executa `npm test -w <namespace>/<nome-do-modulo>`.

### Apenas pacote reutilizavel em `modules/*`

Use o script da skill a partir da raiz do projeto:

```bash
node .agents/skills/config-new-module/scripts/create-module.mjs --module <nome-do-modulo> --namespace <namespace>
```

Exemplo:

```bash
node .agents/skills/config-new-module/scripts/create-module.mjs --module auth --namespace @meu-projeto
```

O script:

1. Valida `--namespace` e `--module`.
2. Copia os assets para `modules/<nome-do-modulo>/`.
3. Substitui `__PACKAGE_NAME__`, `__PACKAGE_NAMESPACE__` e `__MODULE_NAME__` nos arquivos copiados.
4. Cria `modules/<nome-do-modulo>/pages/<nome-do-modulo>.page.tsx`.
5. Cria `modules/<nome-do-modulo>/components/<nome-do-modulo>.component.tsx`.
6. Atualiza os `package.json` da raiz, frontend e backend.
7. Executa `npm install`.
8. Executa `npm run build`.
9. Executa `npm test -w <namespace>/<nome-do-modulo>`.

### Pacote reutilizavel + rota privada no frontend

Use o script da skill a partir da raiz do projeto:

```bash
node .agents/skills/config-new-module/scripts/create-module.mjs --module <nome-do-modulo> --namespace <namespace> --app frontend
```

Exemplo:

```bash
node .agents/skills/config-new-module/scripts/create-module.mjs --module profile --namespace @meu-projeto --app frontend
```

O script:

1. Valida `--namespace`, `--module` e `--app frontend`.
2. Cria o pacote reutilizavel em `modules/<nome-do-modulo>/`.
3. Cria a pagina principal em `modules/<nome-do-modulo>/pages/<nome-do-modulo>.page.tsx`.
4. Cria o componente principal em `modules/<nome-do-modulo>/components/<nome-do-modulo>.component.tsx`.
5. Cria a rota privada em `apps/frontend/src/app/(private)/<nome-do-modulo>/page.tsx`.
6. Atualiza os `package.json` da raiz, frontend e backend.
7. Executa `npm install`.
8. Executa `npm run build`.
9. Executa `npm test -w <namespace>/<nome-do-modulo>`.

### Pacote reutilizavel + modulo local no backend

Use o script da skill a partir da raiz do projeto:

```bash
node .agents/skills/config-new-module/scripts/create-module.mjs --module <nome-do-modulo> --namespace <namespace> --app backend
```

Exemplo:

```bash
node .agents/skills/config-new-module/scripts/create-module.mjs --module billing --namespace @meu-projeto --app backend
```

O script:

1. Valida `--namespace`, `--module` e `--app backend`.
2. Cria o pacote reutilizavel em `modules/<nome-do-modulo>/`.
3. Cria `apps/backend/src/modules/<nome-do-modulo>/`.
4. Cria `<nome-do-modulo>.module.ts`, `<nome-do-modulo>.controller.ts` e `index.ts`.
5. Registra o modulo em `apps/backend/src/app.module.ts`.
6. Atualiza os `package.json` da raiz, frontend e backend.
7. Executa `npm install`.
8. Executa `npm run build`.
9. Executa `npm test -w <namespace>/<nome-do-modulo>`.

### Pacote reutilizavel + frontend + backend

Use o script da skill a partir da raiz do projeto:

```bash
node .agents/skills/config-new-module/scripts/create-module.mjs --module <nome-do-modulo> --namespace <namespace> --app frontend --app backend
```

Ou:

```bash
node .agents/skills/config-new-module/scripts/create-module.mjs --module <nome-do-modulo> --namespace <namespace> --apps frontend,backend
```

Exemplo:

```bash
node .agents/skills/config-new-module/scripts/create-module.mjs --module dashboard --namespace @meu-projeto --app frontend --app backend
```

O script:

1. Valida `--namespace`, `--module` e os apps informados.
2. Para antes de criar arquivos se qualquer destino ja existir.
3. Cria o pacote reutilizavel em `modules/<nome-do-modulo>/`.
4. Cria a rota privada em `apps/frontend/src/app/(private)/<nome-do-modulo>/page.tsx`.
5. Cria o modulo local em `apps/backend/src/modules/<nome-do-modulo>/`.
6. Faz as integracoes de app chamarem o pacote de negocio criado.
7. Atualiza os `package.json` da raiz, frontend e backend.
8. Executa `npm install`.
9. Executa `npm run build`.
10. Executa `npm test -w <namespace>/<nome-do-modulo>`.

## Excecoes

- Se `modules/<nome-do-modulo>` ja existir, parar e pedir confirmacao antes de sobrescrever ou adaptar qualquer arquivo.
- Se `packages/<nome-do-modulo>` ja existir, parar e pedir confirmacao antes de sobrescrever ou adaptar qualquer arquivo.
- Se `apps/frontend/src/app/(private)/<nome-do-modulo>` ja existir, parar e pedir confirmacao antes de sobrescrever ou adaptar qualquer arquivo.
- Se `apps/backend/src/modules/<nome-do-modulo>` ja existir, parar e pedir confirmacao antes de sobrescrever ou adaptar qualquer arquivo.
- Se qualquer destino solicitado ja existir, parar antes de criar os demais destinos.
- Se `apps/frontend/package.json`, `apps/backend/package.json` ou `package.json` da raiz nao existir, parar e explicar qual arquivo esperado esta ausente.
- Para integracao de backend, se `apps/backend/src/app.module.ts` nao existir, parar e explicar o arquivo esperado ausente.
- Usar as flags `--skip-install`, `--skip-build` ou `--skip-test` somente quando o usuario pedir explicitamente para pular uma etapa.
