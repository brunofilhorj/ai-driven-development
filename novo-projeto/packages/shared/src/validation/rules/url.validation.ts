import type { IValidation } from "../validation.interface";

class UrlValidation implements IValidation<string> {
  errorCode = "invalid_url";

  validate(value: string): string | null {
    try {
      if (typeof value !== "string" || value.trim() !== value || value.length === 0) {
        return this.errorCode;
      }

      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:" ? null : this.errorCode;
    } catch {
      return this.errorCode;
    }
  }
}

export { UrlValidation };
