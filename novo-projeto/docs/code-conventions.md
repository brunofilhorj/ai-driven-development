# Convenções de código

Este documento registra os padrões de nomenclatura e organização adotados no
monorepo. Novos códigos e refatorações devem preservar estas convenções.

## TypeScript

- Funções e métodos usam `camelCase` e começam com letra minúscula.
- Classes, interfaces, tipos e enums usam `PascalCase`.
- Variáveis e parâmetros usam `camelCase`.
- Constantes globais usam `UPPER_SNAKE_CASE` quando representam valores
  imutáveis compartilhados.
- Tipos genéricos devem ter nomes que expressem seu papel quando isso melhorar
  a leitura, como `Input` e `Output`.

Exemplo:

```ts
interface UseCase<Input, Output> {
  execute(input: Input): Promise<Output>;
}
```

## Arquivos e diretórios

- Arquivos TypeScript usam letras minúsculas e `kebab-case`.
- O nome do arquivo deve representar o conceito no singular quando ele declara
  um único conceito principal, como `use-case.ts`.
- Arquivos de teste usam o mesmo nome do arquivo testado com o sufixo
  `.test.ts`, como `use-case.test.ts`.
- Diretórios usam letras minúsculas e `kebab-case`.

## Testes

- Testes ficam em `test`, separados do código de produção.
- A estrutura de diretórios de `test` deve espelhar a estrutura de `src`.
- Um teste deve ficar no diretório equivalente ao arquivo ou à área que ele
  valida.
- A separação entre `src` e `test` deve impedir que testes participem do build
  de produção.

Exemplos:

```text
src/
├── model/
│   └── entity.ts
└── usecase/
    └── use-case.ts
test/
├── model/
│   └── entity.test.ts
└── usecase/
    └── use-case.test.ts
```
