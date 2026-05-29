import type { IValidation } from "../validation.interface";

class IntegerValidation implements IValidation<number> {
  errorCode = "invalid_integer";

  validate(value: number): string | null {
    return typeof value === "number" && Number.isInteger(value) ? null : this.errorCode;
  }
}

export { IntegerValidation };
