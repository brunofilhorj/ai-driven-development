import type { IValidation } from "../validation.interface";

class MaxLengthValidation implements IValidation<string> {
  errorCode = "max_length";

  constructor(private readonly maxLength: number) {}

  validate(value: string): string | null {
    return typeof value === "string" && value.length <= this.maxLength ? null : this.errorCode;
  }
}

export { MaxLengthValidation };
