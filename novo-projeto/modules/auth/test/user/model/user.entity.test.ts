/// <reference types="jest" />

import { ValidationException } from "@poupig/shared";

import { User } from "../../../src/user/model/user.entity";

const validUserState = {
  name: "José da Silva",
  email: "jose@example.com",
  password: "$2b$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
};

describe("User", () => {
  test("Deve criar um usuario valido com os dados e datas da entidade base", () => {
    const user = new User(validUserState);

    expect(user.id).toBeDefined();
    expect(user.name).toBe(validUserState.name);
    expect(user.email).toBe(validUserState.email);
    expect(user.password).toBe(validUserState.password);
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toEqual(user.createdAt);
    expect(user.deletedAt).toBeNull();
  });

  test.each(["Jo", "A".repeat(81), "José @ Silva", "José_ Silva"])(
    "Deve rejeitar o nome invalido %s",
    (name) => {
      const user = new User({ ...validUserState, name });

      expect(() => user.validate()).toThrow(ValidationException);
    },
  );

  test.each(["jose", "jose@", "@example.com", "jose example.com"])(
    "Deve rejeitar o email invalido %s",
    (email) => {
      const user = new User({ ...validUserState, email });

      expect(() => user.validate()).toThrow(ValidationException);
    },
  );

  test.each([
    "SenhaForte1!",
    "$2b$03$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
    "$2c$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
  ])(
    "Deve rejeitar a senha que nao seja um hash bcrypt valido %s",
    (password) => {
      const user = new User({ ...validUserState, password });

      expect(() => user.validate()).toThrow(ValidationException);
    },
  );

  test("Deve clonar o usuario atualizando seus dados e updatedAt", () => {
    const updatedAt = new Date("2026-01-01T10:00:00.000Z");
    const user = new User({ ...validUserState, updatedAt });

    const clonedUser = user.clone({
      name: "Maria da Silva",
      email: "maria@example.com",
    });

    expect(clonedUser.id).toBe(user.id);
    expect(clonedUser.name).toBe("Maria da Silva");
    expect(clonedUser.email).toBe("maria@example.com");
    expect(clonedUser.createdAt).toBe(user.createdAt);
    expect(clonedUser.updatedAt.getTime()).toBeGreaterThan(updatedAt.getTime());
  });

  test("Deve identificar os campos do usuario nos erros de validacao", () => {
    const user = new User({
      name: "Jo",
      email: "email-invalido",
      password: "fraca",
    });

    try {
      user.validate();
      throw new Error("A validacao deveria ter falhado");
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationException);
      expect((error as ValidationException).errors.map((item) => item.fullCode)).toEqual([
        "user.name.min_length",
        "user.name.invalid_person_name",
        "user.email.invalid_email",
        "user.password.invalid_bcrypt_hash",
      ]);
    }
  });
});
