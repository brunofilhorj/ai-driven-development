import type { IValidation } from "../validation.interface";

class UuidValidation implements IValidation<string> {
  errorCode = "invalid_uuid";

  validate(value: string): string | null {
    return typeof value === "string" &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
      ? null
      : this.errorCode;
  }
}

export { UuidValidation };
