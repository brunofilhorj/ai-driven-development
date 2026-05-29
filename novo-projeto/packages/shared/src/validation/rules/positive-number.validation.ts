import type { IValidation } from "../validation.interface";

class PositiveNumberValidation implements IValidation<number> {
  errorCode = "positive_number";

  validate(value: number): string | null {
    return typeof value === "number" && Number.isFinite(value) && value > 0 ? null : this.errorCode;
  }
}

export { PositiveNumberValidation };
