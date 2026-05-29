import type { IValidation } from "../validation.interface";

class StrongPasswordValidation implements IValidation<string> {
  errorCode = "weak_password";

  validate(value: string): string | null {
    return typeof value === "string" &&
      /[A-Z]/.test(value) &&
      /[a-z]/.test(value) &&
      /\d/.test(value) &&
      /[^A-Za-z0-9]/.test(value)
      ? null
      : this.errorCode;
  }
}

export { StrongPasswordValidation };
