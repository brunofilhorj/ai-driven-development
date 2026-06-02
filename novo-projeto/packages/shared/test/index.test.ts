import {
  AgeValidation,
  DomainError,
  EmailValidation,
  FieldValidator,
  MaxLengthValidation,
  MinLengthValidation,
  NotFoundError,
  RequiredValidation,
  UnauthorizedError,
  ValidationError,
  ValidationException,
  Validator,
} from "../src/index";

test("Deve expor erros de dominio com status HTTP", () => {
  expect(new DomainError("Erro").statusCode).toBe(400);
  expect(new ValidationException([]).statusCode).toBe(422);
  expect(new NotFoundError("Item nao encontrado").statusCode).toBe(404);
  expect(new UnauthorizedError("Acesso negado").statusCode).toBe(401);
});

test("Deve compor o codigo completo do erro de validacao", () => {
  const error = new ValidationError("user.email", "invalid_email");

  expect(error.fullCode).toBe("user.email.invalid_email");
  expect(error.fieldCode).toBe("user.email");
  expect(error.errorCode).toBe("invalid_email");
});

test("Deve coletar todos os erros antes de lancar a exception", () => {
  const validator = new Validator([
    {
      fieldCode: "user.email",
      validations: [new RequiredValidation(), new EmailValidation()],
    },
    {
      fieldCode: "user.name",
      validations: [new MinLengthValidation(3), new MaxLengthValidation(10)],
    },
    {
      fieldCode: "user.age",
      validations: [new AgeValidation()],
    },
  ]);

  expect(() => validator.validate({ user: { email: "", name: "Al", age: -1 } }))
    .toThrow(ValidationException);

  try {
    validator.validate({ user: { email: "", name: "Al", age: -1 } });
  } catch (error) {
    expect(error).toBeInstanceOf(ValidationException);
    expect((error as ValidationException).errors.map((item) => item.fullCode)).toEqual([
      "user.email.required",
      "user.email.invalid_email",
      "user.name.min_length",
      "user.age.invalid_age",
    ]);
  }
});

test("Deve retornar null quando uma validacao concreta nao encontrar erro", () => {
  expect(new EmailValidation().validate("email@teste.com")).toBeNull();
  expect(new EmailValidation().validate("email-invalido")).toBe("invalid_email");
});

test("Deve manter compatibilidade com FieldValidator explicito", () => {
  const fieldValidator = new FieldValidator("user.email", [new EmailValidation()]);

  expect(fieldValidator.validate("email@teste.com")).toEqual([]);
  expect(fieldValidator.validate("email-invalido").map((error) => error.fullCode)).toEqual([
    "user.email.invalid_email",
  ]);
});

test("Deve buscar valor pelo ultimo segmento quando o caminho completo nao existir", () => {
  const validator = new Validator([
    {
      fieldCode: "user.email",
      validations: [new EmailValidation()],
    },
  ]);

  expect(() => validator.validate({ email: "email@teste.com" })).not.toThrow();
});
