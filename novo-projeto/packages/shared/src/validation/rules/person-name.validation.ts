import type { IValidation } from "../validation.interface";

const DEFAULT_PERSON_NAME_PATTERN = /^[\p{L}'-]+(?: +[\p{L}'-]+)+$/u;

class PersonNameValidation implements IValidation<string> {
  errorCode = "invalid_person_name";

  constructor(private readonly pattern: RegExp = DEFAULT_PERSON_NAME_PATTERN) {}

  validate(value: string): string | null {
    if (typeof value !== "string") {
      return this.errorCode;
    }

    this.pattern.lastIndex = 0;

    return this.pattern.test(value) ? null : this.errorCode;
  }
}

export { PersonNameValidation };
