import type { IValidation } from "../validation.interface";

class PhoneValidation implements IValidation<string> {
  errorCode = "invalid_phone";

  validate(value: string): string | null {
    return typeof value === "string" && /^\+[1-9]\d{1,14}$/.test(value) ? null : this.errorCode;
  }
}

export { PhoneValidation };
