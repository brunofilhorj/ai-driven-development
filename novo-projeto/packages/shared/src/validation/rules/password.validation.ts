import type { IValidation } from "../validation.interface";

class PasswordValidation implements IValidation<string> {
  errorCode = "invalid_password";

  validate(value: string): string | null {
    return typeof value === "string" && /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(value)
      ? null
      : this.errorCode;
  }
}

export { PasswordValidation };
