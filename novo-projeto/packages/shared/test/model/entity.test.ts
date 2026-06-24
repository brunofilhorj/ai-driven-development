import {
  EmailValidation,
  Entity,
  type EntityState,
  MinLengthValidation,
  RequiredValidation,
  UuidValidation,
  ValidationException,
  Validator,
} from "../../src/index";

interface UserState extends EntityState {
  name: string;
  email: string;
  password: string;
}

class User extends Entity<UserState> {
  constructor(props: UserState) {
    super(props);
    this.validate();
  }

  validate(): void {
    new Validator([
      {
        fieldCode: "id",
        validations: [new UuidValidation()],
      },
      {
        fieldCode: "name",
        validations: [new RequiredValidation(), new MinLengthValidation(3)],
      },
      {
        fieldCode: "email",
        validations: [new RequiredValidation(), new EmailValidation()],
      },
      {
        fieldCode: "password",
        validations: [new RequiredValidation(), new MinLengthValidation(8)],
      },
    ]).validate({ ...this.props });
  }

  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }
}

const validUserProps = {
  name: "Jose",
  email: "jose@example.com",
  password: "senha-segura",
};

describe("Entity", () => {
  test("Deve gerar um UUID v4 quando o id nao for informado", () => {
    const user = new User(validUserProps);

    expect(user.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });

  test("Deve gerar as datas de criacao e alteracao e iniciar sem exclusao", () => {
    const beforeCreation = new Date();
    const user = new User(validUserProps);
    const afterCreation = new Date();

    expect(user.createdAt.getTime()).toBeGreaterThanOrEqual(beforeCreation.getTime());
    expect(user.createdAt.getTime()).toBeLessThanOrEqual(afterCreation.getTime());
    expect(user.updatedAt).toEqual(user.createdAt);
    expect(user.deletedAt).toBeNull();
  });

  test("Deve manter as datas informadas ao reconstruir uma entidade", () => {
    const createdAt = new Date("2026-01-01T10:00:00.000Z");
    const updatedAt = new Date("2026-01-02T10:00:00.000Z");
    const deletedAt = new Date("2026-01-03T10:00:00.000Z");

    const user = new User({
      ...validUserProps,
      createdAt,
      updatedAt,
      deletedAt,
    });

    expect(user.createdAt).toBe(createdAt);
    expect(user.updatedAt).toBe(updatedAt);
    expect(user.deletedAt).toBe(deletedAt);
  });

  test("Deve manter o id informado", () => {
    const id = "550e8400-e29b-41d4-a716-446655440000";

    expect(new User({ ...validUserProps, id }).id).toBe(id);
  });

  test("Deve comparar entidades pelo UUID", () => {
    const id = "550e8400-e29b-41d4-a716-446655440000";
    const user = new User({ ...validUserProps, id });

    expect(user.equals(new User({ ...validUserProps, id }))).toBe(true);
    expect(user.equals(new User(validUserProps))).toBe(false);
    expect(user.equals()).toBe(false);
  });

  test("Deve copiar a entidade mesclando um estado parcial sem alterar a original", () => {
    const user = new User(validUserProps);

    const copiedUser = user.copy({
      name: "Maria",
      email: "maria@example.com",
    });

    expect(copiedUser).toBeInstanceOf(User);
    expect(copiedUser).not.toBe(user);
    expect(copiedUser.id).toBe(user.id);
    expect(copiedUser.name).toBe("Maria");
    expect(copiedUser.email).toBe("maria@example.com");
    expect(user.name).toBe("Jose");
    expect(user.email).toBe("jose@example.com");
  });

  test("Deve clonar a entidade mantendo a criacao e atualizando a data de alteracao", () => {
    const createdAt = new Date("2026-01-01T10:00:00.000Z");
    const updatedAt = new Date("2026-01-02T10:00:00.000Z");
    const user = new User({ ...validUserProps, createdAt, updatedAt });

    const clonedUser = user.clone({ name: "Maria" });

    expect(clonedUser.id).toBe(user.id);
    expect(clonedUser.createdAt).toBe(createdAt);
    expect(clonedUser.updatedAt.getTime()).toBeGreaterThan(updatedAt.getTime());
    expect(clonedUser.name).toBe("Maria");
    expect(user.name).toBe("Jose");
    expect(user.updatedAt).toBe(updatedAt);
  });

  test("Deve permitir que a entidade concreta implemente sua validacao interna", () => {
    expect(
      () =>
        new User({
          name: "Jo",
          email: "email-invalido",
          password: "curta",
        }),
    ).toThrow(ValidationException);
  });
});
