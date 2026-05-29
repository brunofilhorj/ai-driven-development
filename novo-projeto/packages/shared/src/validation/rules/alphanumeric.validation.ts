import type { IValidation } from "../validation.interface";

class AlphanumericValidation implements IValidation<string> {
  errorCode = "invalid_alphanumeric";

  validate(value: string): string | null {
    return typeof value === "string" && /^[A-Za-z0-9]+$/.test(value) ? null : this.errorCode;
  }
}

export { AlphanumericValidation };
