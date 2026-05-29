import type { IValidation } from "../validation.interface";

class EmailValidation implements IValidation<string> {
  errorCode = "invalid_email";

  validate(value: string): string | null {
    return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ? null
      : this.errorCode;
  }
}

export { EmailValidation };
