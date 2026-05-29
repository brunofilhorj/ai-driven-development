import type { IValidation } from "../validation.interface";

class DateValidation implements IValidation<string | Date> {
  errorCode = "invalid_date";

  validate(value: string | Date): string | null {
    const date = value instanceof Date ? value : new Date(value);
    return !Number.isNaN(date.getTime()) ? null : this.errorCode;
  }
}

export { DateValidation };
