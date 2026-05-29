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

## Validadores compartilhados

O pacote `@poupig/shared` expoe validadores reutilizaveis em `src/validation`. Todos retornam `null` quando o valor e valido ou o proprio `errorCode` quando invalido.

| Validador | Tipo aceito | errorCode |
| --- | --- | --- |
| `RequiredValidation` | `unknown` | `required` |
| `EmailValidation` | `string` | `invalid_email` |
| `MinLengthValidation` | `string` | `min_length` |
| `MaxLengthValidation` | `string` | `max_length` |
| `PasswordValidation` | `string` | `invalid_password` |
| `PersonalNameValidation` | `string` | `invalid_personal_name` |
| `AgeValidation` | `number` | `invalid_age` |
| `DateValidation` | `string \| Date` | `invalid_date` |
| `UrlValidation` | `string` | `invalid_url` |
| `SlugValidation` | `string` | `invalid_slug` |
| `NoWhitespaceValidation` | `string` | `no_whitespace` |
| `AlphanumericValidation` | `string` | `invalid_alphanumeric` |
| `RegexValidation` | `string` | construtor |
| `JsonValidation` | `string` | `invalid_json` |
| `UuidValidation` | `string` | `invalid_uuid` |
| `CpfValidation` | `string` | `invalid_cpf` |
| `CnpjValidation` | `string` | `invalid_cnpj` |
| `PhoneValidation` | `string` | `invalid_phone` |
| `StrongPasswordValidation` | `string` | `weak_password` |
| `NoCommonPasswordsValidation` | `string` | `common_password` |
| `PasswordMatchValidation` | `string` | `password_mismatch` |
| `DateFormatValidation` | `string` | `invalid_date_format` |
| `PastDateValidation` | `string` | `not_past_date` |
| `FutureDateValidation` | `string` | `not_future_date` |
| `MinimumAgeValidation` | `string` | `minimum_age` |
| `MinValueValidation` | `number` | `min_value` |
| `MaxValueValidation` | `number` | `max_value` |
| `IntegerValidation` | `number` | `invalid_integer` |
| `PositiveNumberValidation` | `number` | `positive_number` |
| `PrecisionValidation` | `number` | `invalid_precision` |
| `MinItemsValidation` | `unknown[]` | `min_items` |
| `MaxItemsValidation` | `unknown[]` | `max_items` |
| `UniqueItemsValidation` | `unknown[]` | `duplicate_items` |

Validacao de JSON faz sentido quando a API recebe JSON como string bruta, por exemplo em campos de configuracao, webhooks ou CLIs. Para DTOs ja parseados pelo NestJS/Express, normalmente e melhor validar o objeto resultante com regras de campos (`RequiredValidation`, `MinItemsValidation`, `UuidValidation` etc.) em vez de aceitar uma string JSON. Outras regras comuns para requests modernos que podem entrar em uma proxima iteracao: enum, boolean, object-shape, file-size, mime-type, ip-address, port, credit-card, postal-code e range-date.
