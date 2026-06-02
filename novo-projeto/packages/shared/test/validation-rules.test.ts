import {
  AlphanumericValidation,
  CnpjValidation,
  CpfValidation,
  DateValidation,
  DateFormatValidation,
  FutureDateValidation,
  IntegerValidation,
  JsonValidation,
  MaxItemsValidation,
  MaxValueValidation,
  MinimumAgeValidation,
  MinItemsValidation,
  MinValueValidation,
  NoCommonPasswordsValidation,
  NoWhitespaceValidation,
  PasswordValidation,
  PasswordMatchValidation,
  PastDateValidation,
  PersonalNameValidation,
  PhoneValidation,
  PositiveNumberValidation,
  PrecisionValidation,
  RegexValidation,
  RequiredValidation,
  SlugValidation,
  StrongPasswordValidation,
  UniqueItemsValidation,
  UrlValidation,
  UuidValidation,
} from "../src/index";

function isoDateFromToday(dayOffset: number): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + dayOffset);
  return date.toISOString().slice(0, 10);
}

function isoDateYearsAgo(years: number, dayOffset = 0): string {
  const date = new Date();
  date.setUTCFullYear(date.getUTCFullYear() - years);
  date.setUTCDate(date.getUTCDate() + dayOffset);
  return date.toISOString().slice(0, 10);
}

describe("string validations", () => {
  test("UrlValidation valida apenas URLs http/https absolutas", () => {
    const validation = new UrlValidation();

    expect(validation.validate("https://example.com/path")).toBeNull();
    expect(validation.validate("ftp://example.com")).toBe("invalid_url");
    expect(validation.validate(" https://example.com")).toBe("invalid_url");
    expect(validation.validate("http://")).toBe("invalid_url");
    expect(validation.validate(123 as unknown as string)).toBe("invalid_url");
  });

  test("SlugValidation aceita slug canonico em minusculas", () => {
    const validation = new SlugValidation();

    expect(validation.validate("meu-produto-123")).toBeNull();
    expect(validation.validate("Meu Produto")).toBe("invalid_slug");
    expect(validation.validate("slug--duplo")).toBe("invalid_slug");
  });

  test("NoWhitespaceValidation rejeita qualquer espaco em branco", () => {
    const validation = new NoWhitespaceValidation();

    expect(validation.validate("abc123")).toBeNull();
    expect(validation.validate("abc 123")).toBe("no_whitespace");
    expect(validation.validate("abc\t123")).toBe("no_whitespace");
  });

  test("AlphanumericValidation aceita apenas letras e numeros", () => {
    const validation = new AlphanumericValidation();

    expect(validation.validate("abcXYZ123")).toBeNull();
    expect(validation.validate("abc-123")).toBe("invalid_alphanumeric");
    expect(validation.validate("")).toBe("invalid_alphanumeric");
  });

  test("RegexValidation usa RegExp e errorCode customizados", () => {
    const validation = new RegexValidation(/^BR-\d{3}$/g, "invalid_code");
    const throwingValidation = new RegexValidation(
      {
        get lastIndex() {
          return 0;
        },
        set lastIndex(_value: number) {
          throw new Error("pattern unavailable");
        },
        test() {
          return true;
        },
      } as unknown as RegExp,
      "invalid_code",
    );

    expect(validation.validate("BR-123")).toBeNull();
    expect(validation.validate("US-123")).toBe("invalid_code");
    expect(validation.validate("BR-123")).toBeNull();
    expect(validation.validate(123 as unknown as string)).toBe("invalid_code");
    expect(throwingValidation.validate("BR-123")).toBe("invalid_code");
  });

  test("JsonValidation valida strings JSON brutas", () => {
    const validation = new JsonValidation();

    expect(validation.validate('{"enabled":true}')).toBeNull();
    expect(validation.validate("{enabled:true}")).toBe("invalid_json");
    expect(validation.validate("")).toBe("invalid_json");
  });
});

describe("identifier validations", () => {
  test("UuidValidation valida UUID v4 RFC 4122", () => {
    const validation = new UuidValidation();

    expect(validation.validate("550e8400-e29b-41d4-a716-446655440000")).toBeNull();
    expect(validation.validate("550e8400-e29b-11d4-a716-446655440000")).toBe("invalid_uuid");
    expect(validation.validate("not-a-uuid")).toBe("invalid_uuid");
  });

  test("CpfValidation valida digitos verificadores de CPF", () => {
    const validation = new CpfValidation();

    expect(validation.validate("529.982.247-25")).toBeNull();
    expect(validation.validate(52998224725 as unknown as string)).toBe("invalid_cpf");
    expect(validation.validate("529.982.247-26")).toBe("invalid_cpf");
    expect(validation.validate("111.111.111-11")).toBe("invalid_cpf");
    expect(
      validation.validate({
        replace() {
          throw new Error("cpf unavailable");
        },
      } as unknown as string),
    ).toBe("invalid_cpf");
  });

  test("CnpjValidation valida digitos verificadores de CNPJ", () => {
    const validation = new CnpjValidation();

    expect(validation.validate("04.252.011/0001-10")).toBeNull();
    expect(validation.validate(4252011000110 as unknown as string)).toBe("invalid_cnpj");
    expect(validation.validate("04.252.011/0001-11")).toBe("invalid_cnpj");
    expect(validation.validate("00.000.000/0000-00")).toBe("invalid_cnpj");
    expect(
      validation.validate({
        replace() {
          throw new Error("cnpj unavailable");
        },
      } as unknown as string),
    ).toBe("invalid_cnpj");
  });

  test("PhoneValidation valida formato E.164", () => {
    const validation = new PhoneValidation();

    expect(validation.validate("+5511999999999")).toBeNull();
    expect(validation.validate("5511999999999")).toBe("invalid_phone");
    expect(validation.validate("+05511999999999")).toBe("invalid_phone");
  });
});

describe("password validations", () => {
  test("PasswordValidation exige tamanho minimo e numero", () => {
    const validation = new PasswordValidation();

    expect(validation.validate("senha123")).toBeNull();
    expect(validation.validate("senhasemnumero")).toBe("invalid_password");
    expect(validation.validate("abc12")).toBe("invalid_password");
  });

  test("StrongPasswordValidation exige quatro categorias de caracteres", () => {
    const validation = new StrongPasswordValidation();

    expect(validation.validate("Abc123!")).toBeNull();
    expect(validation.validate("abc123!")).toBe("weak_password");
    expect(validation.validate("Abcdef1")).toBe("weak_password");
  });

  test("NoCommonPasswordsValidation rejeita senhas comuns", () => {
    const validation = new NoCommonPasswordsValidation();

    expect(validation.validate("MinhaSenhaForte!123")).toBeNull();
    expect(validation.validate("password")).toBe("common_password");
    expect(validation.validate("PASSWORD")).toBe("common_password");
  });

  test("PasswordMatchValidation compara com confirmacao externa", () => {
    const validation = new PasswordMatchValidation(() => "Abc123!");
    const failingValidation = new PasswordMatchValidation(() => {
      throw new Error("confirmation unavailable");
    });

    expect(validation.validate("Abc123!")).toBeNull();
    expect(validation.validate("Abc123?")).toBe("password_mismatch");
    expect(failingValidation.validate("Abc123!")).toBe("password_mismatch");
  });
});

describe("date validations", () => {
  test("DateValidation aceita datas parseaveis e rejeita datas invalidas", () => {
    const validation = new DateValidation();

    expect(validation.validate("2024-01-01")).toBeNull();
    expect(validation.validate(new Date("2024-01-01T00:00:00Z"))).toBeNull();
    expect(validation.validate("data-invalida")).toBe("invalid_date");
  });

  test("DateFormatValidation valida data ISO 8601 existente", () => {
    const validation = new DateFormatValidation();

    expect(validation.validate("2024-02-29")).toBeNull();
    expect(validation.validate("2024-02-30")).toBe("invalid_date_format");
    expect(validation.validate("2024-01-01T10:20:30Z")).toBeNull();
    expect(validation.validate("2024/01/01")).toBe("invalid_date_format");
    expect(validation.validate(20240101 as unknown as string)).toBe("invalid_date_format");
  });

  test("PastDateValidation exige data anterior a hoje", () => {
    const validation = new PastDateValidation();

    expect(validation.validate(isoDateFromToday(-1))).toBeNull();
    expect(validation.validate(isoDateFromToday(1))).toBe("not_past_date");
    expect(validation.validate(isoDateFromToday(0))).toBe("not_past_date");
    expect(validation.validate("2024-02-30")).toBe("not_past_date");
    expect(validation.validate(20240101 as unknown as string)).toBe("not_past_date");
  });

  test("FutureDateValidation exige data posterior a hoje", () => {
    const validation = new FutureDateValidation();

    expect(validation.validate(isoDateFromToday(1))).toBeNull();
    expect(validation.validate(isoDateFromToday(-1))).toBe("not_future_date");
    expect(validation.validate(isoDateFromToday(0))).toBe("not_future_date");
    expect(validation.validate("2024-02-30")).toBe("not_future_date");
    expect(validation.validate(20240101 as unknown as string)).toBe("not_future_date");
  });

  test("MinimumAgeValidation valida idade minima por data de nascimento", () => {
    const validation = new MinimumAgeValidation(18);

    expect(validation.validate(isoDateYearsAgo(18))).toBeNull();
    expect(validation.validate(isoDateYearsAgo(18, 1))).toBe("minimum_age");
    expect(validation.validate("2024-02-30")).toBe("minimum_age");
    expect(validation.validate("01/01/2000")).toBe("minimum_age");
    expect(validation.validate(20000101 as unknown as string)).toBe("minimum_age");
    expect(new MinimumAgeValidation(-1).validate("2000-01-01")).toBe("minimum_age");
  });
});

describe("number validations", () => {
  test("MinValueValidation exige valor minimo", () => {
    const validation = new MinValueValidation(10);

    expect(validation.validate(10)).toBeNull();
    expect(validation.validate(9)).toBe("min_value");
    expect(validation.validate(Number.NaN)).toBe("min_value");
  });

  test("MaxValueValidation exige valor maximo", () => {
    const validation = new MaxValueValidation(10);

    expect(validation.validate(10)).toBeNull();
    expect(validation.validate(11)).toBe("max_value");
    expect(validation.validate(Number.POSITIVE_INFINITY)).toBe("max_value");
  });

  test("IntegerValidation rejeita decimais", () => {
    const validation = new IntegerValidation();

    expect(validation.validate(10)).toBeNull();
    expect(validation.validate(10.5)).toBe("invalid_integer");
    expect(validation.validate(Number.NaN)).toBe("invalid_integer");
  });

  test("PositiveNumberValidation exige numero maior que zero", () => {
    const validation = new PositiveNumberValidation();

    expect(validation.validate(0.01)).toBeNull();
    expect(validation.validate(0)).toBe("positive_number");
    expect(validation.validate(-1)).toBe("positive_number");
  });

  test("PrecisionValidation limita casas decimais", () => {
    const validation = new PrecisionValidation(2);

    expect(validation.validate(10.12)).toBeNull();
    expect(validation.validate(10.123)).toBe("invalid_precision");
    expect(validation.validate(10)).toBeNull();
  });
});

describe("array validations", () => {
  test("MinItemsValidation exige quantidade minima de itens", () => {
    const validation = new MinItemsValidation(2);

    expect(validation.validate([1, 2])).toBeNull();
    expect(validation.validate([1])).toBe("min_items");
    expect(validation.validate([])).toBe("min_items");
  });

  test("MaxItemsValidation exige quantidade maxima de itens", () => {
    const validation = new MaxItemsValidation(2);

    expect(validation.validate([1, 2])).toBeNull();
    expect(validation.validate([1, 2, 3])).toBe("max_items");
    expect(validation.validate([])).toBeNull();
  });

  test("UniqueItemsValidation compara itens serializados com JSON.stringify", () => {
    const validation = new UniqueItemsValidation();
    const circular: unknown[] = [];
    circular.push(circular);

    expect(validation.validate([{ id: 1 }, { id: 2 }])).toBeNull();
    expect(validation.validate("items" as unknown as unknown[])).toBe("duplicate_items");
    expect(validation.validate([{ id: 1 }, { id: 1 }])).toBe("duplicate_items");
    expect(validation.validate(circular)).toBe("duplicate_items");
  });
});

describe("required and personal validations", () => {
  test("RequiredValidation aceita valores preenchidos e rejeita ausentes", () => {
    const validation = new RequiredValidation();

    expect(validation.validate("valor")).toBeNull();
    expect(validation.validate(0)).toBeNull();
    expect(validation.validate(false)).toBeNull();
    expect(validation.validate("   ")).toBe("required");
    expect(validation.validate(null)).toBe("required");
    expect(validation.validate(undefined)).toBe("required");
  });

  test("PersonalNameValidation aceita nomes humanos simples", () => {
    const validation = new PersonalNameValidation();

    expect(validation.validate("Maria Silva")).toBeNull();
    expect(validation.validate("Anne-Marie O'Neill")).toBeNull();
    expect(validation.validate("Maria123")).toBe("invalid_personal_name");
    expect(validation.validate(123 as unknown as string)).toBe("invalid_personal_name");
  });
});
