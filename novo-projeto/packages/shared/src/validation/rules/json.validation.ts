import type { IValidation } from "../validation.interface";

class JsonValidation implements IValidation<string> {
  errorCode = "invalid_json";

  validate(value: string): string | null {
    try {
      if (typeof value !== "string" || value.length === 0) {
        return this.errorCode;
      }

      JSON.parse(value);
      return null;
    } catch {
      return this.errorCode;
    }
  }
}

export { JsonValidation };
