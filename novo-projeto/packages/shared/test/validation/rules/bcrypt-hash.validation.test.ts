/// <reference types="jest" />

import { BcryptHashValidation } from "../../../src/validation/rules/bcrypt-hash.validation";

describe("BcryptHashValidation", () => {
  test.each([
    "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
    "$2b$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
    "$2y$04$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
  ])("Deve aceitar o hash bcrypt %s", (hash) => {
    expect(new BcryptHashValidation().validate(hash)).toBeNull();
  });

  test.each([
    "SenhaForte1!",
    "$2b$03$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
    "$2b$32$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
    "$2c$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
  ])("Deve rejeitar o conteudo que nao seja um hash bcrypt valido", (value) => {
    expect(new BcryptHashValidation().validate(value)).toBe("invalid_bcrypt_hash");
  });
});
