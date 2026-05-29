import type { IValidation } from "../validation.interface";

class MaxItemsValidation implements IValidation<unknown[]> {
  errorCode = "max_items";

  constructor(private readonly max: number) {}

  validate(value: unknown[]): string | null {
    return Array.isArray(value) && Number.isInteger(this.max) && value.length <= this.max
      ? null
      : this.errorCode;
  }
}

export { MaxItemsValidation };
