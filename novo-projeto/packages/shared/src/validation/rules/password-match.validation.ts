import type { IValidation } from "../validation.interface";

class PasswordMatchValidation implements IValidation<string> {
  errorCode = "password_mismatch";

  constructor(private readonly getConfirmation: () => string) {}

  validate(value: string): string | null {
    try {
      return typeof value === "string" && value === this.getConfirmation() ? null : this.errorCode;
    } catch {
      return this.errorCode;
    }
  }
}

export { PasswordMatchValidation };
