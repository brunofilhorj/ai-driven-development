import type { IValidation } from "../validation.interface";

class NoWhitespaceValidation implements IValidation<string> {
  errorCode = "no_whitespace";

  validate(value: string): string | null {
    return typeof value === "string" && value.length > 0 && !/\s/.test(value) ? null : this.errorCode;
  }
}

export { NoWhitespaceValidation };
