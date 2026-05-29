import type { IValidation } from "../validation.interface";

class MinItemsValidation implements IValidation<unknown[]> {
  errorCode = "min_items";

  constructor(private readonly min: number) {}

  validate(value: unknown[]): string | null {
    return Array.isArray(value) && Number.isInteger(this.min) && value.length >= this.min
      ? null
      : this.errorCode;
  }
}

export { MinItemsValidation };
