import type { IValidation } from "../validation.interface";

class RegexValidation implements IValidation<string> {
  constructor(
    private readonly pattern: RegExp,
    readonly errorCode: string,
  ) {}

  validate(value: string): string | null {
    try {
      if (typeof value !== "string") {
        return this.errorCode;
      }

      this.pattern.lastIndex = 0;
      return this.pattern.test(value) ? null : this.errorCode;
    } catch {
      return this.errorCode;
    }
  }
}

export { RegexValidation };
