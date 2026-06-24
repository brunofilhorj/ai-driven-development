# Instruções para agentes

Este repositório é um monorepo TypeScript fullstack em evolução. Antes de alterar
código, leia `docs/PROJECT_CONTEXT.md` e `docs/code-conventions.md`, preservando
as decisões registradas nesses documentos.

## Estrutura

- `apps/frontend`: Next.js 16 com App Router.
- `apps/backend`: NestJS 11, CORS habilitado e porta padrão `4000`.
- `modules/*`: módulos de negócio reutilizados pelos dois apps.
- `packages/*`: infraestrutura e bibliotecas compartilhadas.
- `.agents/skills/*`: skills versionadas que fazem parte do projeto.
- `.codex/*`: artefatos auxiliares produzidos durante sessões do Codex.

## Regras de trabalho

- Responder e registrar decisões em português do Brasil.
- Seguir as convenções de nomenclatura e organização registradas em
  `docs/code-conventions.md`.
- Não editar arquivos gerados em `dist`, `.next`, `.turbo`, `coverage` ou
  `node_modules`.
- Para criar módulos, usar a skill
  `.agents/skills/config-new-module/SKILL.md`; não reproduzir manualmente o
  scaffold.
- O namespace atual dos workspaces é `@poupig`.
- Módulos de negócio ficam em `modules/*`; utilidades globais ficam em
  `packages/*`.
- Integrações NestJS ficam em `apps/backend/src/modules/*`.
- Rotas de frontend apenas compõem páginas exportadas pelos módulos.
- Em mudanças no frontend, ler primeiro `apps/frontend/AGENTS.md` e a
  documentação local em `node_modules/next/dist/docs/`.
- Não transformar os exemplos `somar()` dos módulos atuais em padrão de
  negócio: eles são apenas provas de integração do scaffold.

## Validação mínima

Execute a partir da raiz:

```sh
npm install
npm run check-types
npm run lint
npm test
npm run build
```

O script de lint do backend usa `--fix`; revise o diff depois de executá-lo.
