import type { IValidation } from "../validation.interface";

const ISO_DATE_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})(?:T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?(?:Z|[+-]\d{2}:\d{2}))?$/;

function isValidIsoDate(value: string): boolean {
  const match = ISO_DATE_PATTERN.exec(value);
  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(value);

  return !Number.isNaN(date.getTime()) &&
    new Date(Date.UTC(year, month - 1, day)).getUTCFullYear() === year &&
    new Date(Date.UTC(year, month - 1, day)).getUTCMonth() === month - 1 &&
    new Date(Date.UTC(year, month - 1, day)).getUTCDate() === day;
}

class DateFormatValidation implements IValidation<string> {
  errorCode = "invalid_date_format";

  validate(value: string): string | null {
    try {
      return typeof value === "string" && isValidIsoDate(value) ? null : this.errorCode;
    } catch {
      return this.errorCode;
    }
  }
}

export { DateFormatValidation };
