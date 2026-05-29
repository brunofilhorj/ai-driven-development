import type { IValidation } from "../validation.interface";

class MinLengthValidation implements IValidation<string> {
  errorCode = "min_length";

  constructor(private readonly minLength: number) {}

  validate(value: string): string | null {
    return typeof value === "string" && value.length >= this.minLength ? null : this.errorCode;
  }
}

export { MinLengthValidation };
