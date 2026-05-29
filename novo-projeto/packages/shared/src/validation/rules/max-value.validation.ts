import type { IValidation } from "../validation.interface";

class MaxValueValidation implements IValidation<number> {
  errorCode = "max_value";

  constructor(private readonly max: number) {}

  validate(value: number): string | null {
    return typeof value === "number" &&
      Number.isFinite(value) &&
      Number.isFinite(this.max) &&
      value <= this.max
      ? null
      : this.errorCode;
  }
}

export { MaxValueValidation };
