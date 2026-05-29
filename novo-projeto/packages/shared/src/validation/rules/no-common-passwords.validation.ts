import type { IValidation } from "../validation.interface";

const COMMON_PASSWORDS = new Set([
  "123456",
  "password",
  "123456789",
  "12345",
  "12345678",
  "qwerty",
  "1234567",
  "111111",
  "123123",
  "abc123",
  "password1",
  "1234",
  "iloveyou",
  "1q2w3e4r",
  "000000",
  "qwerty123",
  "zaq12wsx",
  "dragon",
  "sunshine",
  "princess",
]);

class NoCommonPasswordsValidation implements IValidation<string> {
  errorCode = "common_password";

  validate(value: string): string | null {
    return typeof value === "string" && !COMMON_PASSWORDS.has(value.toLowerCase())
      ? null
      : this.errorCode;
  }
}

export { NoCommonPasswordsValidation };
