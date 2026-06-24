# Contexto de continuidade

## Objetivo atual

O repositório é uma base de aprendizado para desenvolvimento orientado por
agentes. Ele demonstra como skills locais podem criar e integrar módulos em um
monorepo fullstack. Ainda não existe um domínio de produto definido.

## Estado importado

- Branch: `main`, acompanhando `origin/main`.
- Runtime esperado: Node.js `>=22`, npm `>=10`.
- Gerenciador: npm workspaces.
- Orquestração: Turbo.
- Namespace: `@poupig`.
- Frontend: Next.js 16, React 19 e Tailwind CSS 4.
- Backend: NestJS 11 com `@nestjs/config`.
- Testes: Jest nos módulos, pacote compartilhado e backend.

Depois da importação neste computador, foi necessário executar `npm install`
para instalar `uuid`, já registrado no `package-lock.json`.

## Mapa dos diretórios

| Caminho | Responsabilidade |
| --- | --- |
| `.agents/skills/config-project-fullstack` | Instruções para criar ou padronizar o monorepo |
| `.agents/skills/config-new-module` | Script e template para novos módulos |
| `.codex/frontend-local.png` | Captura histórica do frontend inicial; o conteúdo real é JPEG |
| `apps/frontend` | Rotas e composição da aplicação web |
| `apps/backend` | Bootstrap, configuração e adaptadores HTTP NestJS |
| `modules/auth` | Prova de integração de um módulo de negócio |
| `modules/reports` | Prova de integração de um módulo de negócio |
| `packages/shared` | Erros de domínio, entidade base e validadores |
| `packages/ui` | Componentes compartilhados originados do scaffold Turbo |
| `packages/eslint-config` | Configurações ESLint compartilhadas |
| `packages/typescript-config` | Configurações TypeScript compartilhadas |

## Fluxo arquitetural pretendido

```text
rota Next.js ─┐
              ├──> modules/<modulo> <── adaptador NestJS
              │             │
              │             └──> packages/shared
              └──> packages/ui
```

Os apps devem permanecer finos. Regras e componentes próprios de uma
capacidade de negócio ficam em `modules/*`; conceitos reutilizáveis entre todos
os módulos ficam em `packages/*`.

## O que já funciona

- `GET /` retorna `Hello World!`.
- `GET /auth` e `GET /reports` comprovam o consumo dos workspaces pelo backend.
- `/auth` e `/reports` comprovam o consumo das páginas dos módulos pelo
  frontend.
- `packages/shared` contém uma entidade base, erros e um conjunto amplo de
  validadores com testes.
- A skill `config-new-module` cria pacote, rota de frontend e módulo NestJS.

## Limites conhecidos

- `auth` e `reports` ainda são scaffolds: a função `somar()` e as telas são
  placeholders, não regras reais.
- A página inicial e os metadados do frontend continuam com o conteúdo padrão
  do Create Next App.
- Os READMEs dentro dos apps são os textos padrão dos geradores e não são a
  fonte de verdade do projeto.
- Só o backend possui `.env.example`; o frontend ainda não possui
  `NEXT_PUBLIC_API_URL` versionado.
- Não há banco de dados, autenticação real, contratos de API, observabilidade,
  pipeline de CI ou estratégia de deploy.
- `npm install` reporta vulnerabilidades de dependências. Avaliar com
  `npm audit` antes de atualizar; não usar `npm audit fix --force` sem revisar
  mudanças incompatíveis.

## Como criar o próximo módulo

Leia a skill completa e use o script versionado:

```sh
node .agents/skills/config-new-module/scripts/create-module.mjs \
  --module <nome> \
  --namespace @poupig \
  --app frontend \
  --app backend
```

Para uma biblioteca global compartilhada, use `--shared` sem flags de app.

## Próximas decisões recomendadas

1. Definir o domínio e o primeiro caso de uso real.
2. Substituir os placeholders de `auth` ou `reports` por uma fatia vertical
   pequena, com contrato, regra de negócio e testes.
3. Definir persistência e configuração de ambiente.
4. Criar contratos explícitos entre frontend e backend.
5. Adicionar CI executando types, lint, testes e build.
6. Revisar e atualizar os templates das skills sempre que o padrão do projeto
   mudar.

## Checklist antes de continuar

```sh
npm install
npm run check-types
npm run lint
npm test
npm run build
git status --short
```

