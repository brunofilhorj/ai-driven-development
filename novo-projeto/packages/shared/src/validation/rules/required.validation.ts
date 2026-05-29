import type { IValidation } from "../validation.interface";

class RequiredValidation implements IValidation<unknown> {
  errorCode = "required";

  validate(value: unknown): string | null {
    if (typeof value === "string") {
      return value.trim().length > 0 ? null : this.errorCode;
    }

    return value !== null && value !== undefined ? null : this.errorCode;
  }
}

export { RequiredValidation };
