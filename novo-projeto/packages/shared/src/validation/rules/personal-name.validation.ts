import type { IValidation } from "../validation.interface";

class PersonalNameValidation implements IValidation<string> {
  errorCode = "invalid_personal_name";

  validate(value: string): string | null {
    return typeof value === "string" && /^[\p{L}' -]+$/u.test(value.trim())
      ? null
      : this.errorCode;
  }
}

export { PersonalNameValidation };
