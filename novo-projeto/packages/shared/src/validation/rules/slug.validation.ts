import type { IValidation } from "../validation.interface";

class SlugValidation implements IValidation<string> {
  errorCode = "invalid_slug";

  validate(value: string): string | null {
    return typeof value === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
      ? null
      : this.errorCode;
  }
}

export { SlugValidation };
