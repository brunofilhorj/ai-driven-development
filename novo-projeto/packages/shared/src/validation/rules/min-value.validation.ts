import type { IValidation } from "../validation.interface";

class MinValueValidation implements IValidation<number> {
  errorCode = "min_value";

  constructor(private readonly min: number) {}

  validate(value: number): string | null {
    return typeof value === "number" &&
      Number.isFinite(value) &&
      Number.isFinite(this.min) &&
      value >= this.min
      ? null
      : this.errorCode;
  }
}

export { MinValueValidation };
