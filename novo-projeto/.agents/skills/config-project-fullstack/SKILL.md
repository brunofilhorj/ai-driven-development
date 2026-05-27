---
name: config-project-fullstack
description: Configure a fullstack Turbo monorepo with a Next.js frontend app, a NestJS backend app, and reusable modules in modules/*. Use when Codex needs to scaffold or standardize a project using create-turbo, create-next-app, Nest CLI, npm workspaces, backend ConfigModule setup, CORS, port 4000, frontend/backend .env examples, and the expected apps/frontend, apps/backend, and modules layout.
---

# Config Project Fullstack

## Overview

Use this skill to create a repeatable fullstack project skeleton: Turbo at the root, Next.js in `apps/frontend`, NestJS in `apps/backend`, and reusable business modules in `modules/*`. Follow the commands and file edits exactly unless the user requests different names, ports, package manager, namespace, or paths.

This project layout must stay compatible with the `config-new-module` skill:

- Root workspaces include both `"apps/*"` and `"modules/*"`.
- The root package has `ts-node` in `devDependencies`.
- Reusable modules are created under `modules/<module-name>/`.
- Frontend module routes can be created under `apps/frontend/src/app/(private)/<module-name>/page.tsx`.
- Backend app modules can be created under `apps/backend/src/modules/<module-name>/` and registered in `apps/backend/src/app.module.ts`.
- App package names should use the chosen namespace, for example `<namespace>/frontend` and `<namespace>/backend`.

## Workflow

1. Create the Turbo workspace:

```bash
npx --yes create-turbo@latest projeto-exemplo -m npm
cd projeto-exemplo
```

2. Remove the default generated apps. Use the shell-appropriate command:

```powershell
Remove-Item apps\* -Recurse -Force
```

```bash
rm -rf apps/*
```

3. Create the frontend app:

```bash
cd apps
npx --yes create-next-app@latest frontend --yes --src-dir
```

4. Install the Nest CLI and create the backend app:

```bash
npm i -g @nestjs/cli --yes
nest new backend --skip-git --package-manager npm
cd backend
npm install @nestjs/config --yes
```

5. Prepare the reusable modules workspace:

```bash
cd ../..
mkdir -p modules
npm install -D ts-node --yes
```

Ensure the root `package.json` contains:

```json
"workspaces": [
  "apps/*",
  "modules/*"
]
```

If the user provides a namespace, align package names with it:

```json
"name": "<namespace>/projeto-exemplo"
```

Use the same namespace for app package names:

```json
"name": "<namespace>/frontend"
```

```json
"name": "<namespace>/backend"
```

If no namespace is provided, ask for it when this project will be used with `config-new-module`; that skill requires `--namespace`.

## Backend Edits

For a new scaffold, set `apps/backend/src/app.module.ts` to:

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

For an existing project, do not replace the whole file if it already registers app modules. Preserve existing imports and existing entries in `imports`, then add or keep only the `ConfigModule.forRoot({ isGlobal: true })` entry.

Set `apps/backend/src/main.ts` to enable CORS and listen on port `4000` by default:

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(process.env.PORT ?? 4000);
}

bootstrap();
```

Add this script to `apps/backend/package.json`:

```json
"dev": "nest start --watch"
```

Preserve existing scripts and add `dev` alongside them.

## Environment Files

Create `apps/frontend/.env.example`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Copy it to `apps/frontend/.env`.

Create `apps/backend/.env.example`:

```env
PORT=4000
```

Copy it to `apps/backend/.env`.

## Frontend Layout

The frontend must use the Next.js App Router with `src/app`.

Keep `apps/frontend/src/app` available for generated routes. Private module routes created by `config-new-module` use this convention:

```text
apps/frontend/src/app/(private)/<module-name>/page.tsx
```

Do not create `apps/frontend/src/modules` as the default module location. Reusable UI/page code for business modules belongs in:

```text
modules/<module-name>/pages/<module-name>.page.tsx
modules/<module-name>/components/<module-name>.component.tsx
```

## Validation

After configuring the project, verify the expected files exist and inspect the modified backend files. Confirm the root `package.json` has `"modules/*"` in `workspaces` and `ts-node` in `devDependencies`. When practical, run the relevant package scripts from the repo root or individual app folders to confirm the frontend and backend can start.
