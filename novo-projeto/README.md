# @poupig/novo-projeto

Monorepo fullstack com Turbo, Next.js, NestJS e workspaces npm.

## Estrutura

- `apps/frontend`: aplicação Next.js com App Router em `src/app`
- `apps/backend`: API NestJS com `@nestjs/config`, CORS habilitado e porta padrão `4000`
- `modules/*`: módulos de negócio reutilizáveis
- `packages/*`: pacotes auxiliares compartilhados do workspace

## Scripts

```sh
npm run dev
npm run build
npm run lint
npm run check-types
```

## Ambiente

O frontend usa `NEXT_PUBLIC_API_URL=http://localhost:4000`.

O backend usa `PORT=4000`.
