import type { IValidation } from "../validation.interface";

class AgeValidation implements IValidation<number> {
  errorCode = "invalid_age";

  validate(value: number): string | null {
    return Number.isInteger(value) && value >= 0 ? null : this.errorCode;
  }
}

export { AgeValidation };
