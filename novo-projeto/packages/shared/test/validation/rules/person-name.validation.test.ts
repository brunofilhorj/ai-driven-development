/// <reference types="jest" />

import { PersonNameValidation } from "../../../src/validation/rules/person-name.validation";

describe("PersonNameValidation", () => {
  test.each([
    "Maria Silva",
    "José da Silva",
    "Anne-Marie O'Neill",
    "Maria  da  Silva",
  ])("Deve aceitar o nome completo %s", (name) => {
    expect(new PersonNameValidation().validate(name)).toBeNull();
  });

  test.each(["Maria", "Maria123 Silva", " Maria Silva", "Maria Silva "])(
    "Deve rejeitar o nome invalido %s",
    (name) => {
      expect(new PersonNameValidation().validate(name)).toBe("invalid_person_name");
    },
  );

  test("Deve permitir configurar a expressao regular", () => {
    const validation = new PersonNameValidation(/^[A-Z]+ [A-Z]+$/);

    expect(validation.validate("MARIA SILVA")).toBeNull();
    expect(validation.validate("Maria Silva")).toBe("invalid_person_name");
  });
});
