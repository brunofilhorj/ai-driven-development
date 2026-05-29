import type { IValidation } from "../validation.interface";

const ISO_DATE_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})(?:T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?(?:Z|[+-]\d{2}:\d{2}))?$/;

function parseIsoDateParts(value: string): { year: number; month: number; day: number } | null {
  const match = ISO_DATE_PATTERN.exec(value);
  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(value);
  const dateOnly = new Date(Date.UTC(year, month - 1, day));

  if (
    Number.isNaN(date.getTime()) ||
    dateOnly.getUTCFullYear() !== year ||
    dateOnly.getUTCMonth() !== month - 1 ||
    dateOnly.getUTCDate() !== day
  ) {
    return null;
  }

  return { year, month, day };
}

function toOrdinalDate(parts: { year: number; month: number; day: number }): number {
  return Date.UTC(parts.year, parts.month - 1, parts.day);
}

class FutureDateValidation implements IValidation<string> {
  errorCode = "not_future_date";

  validate(value: string): string | null {
    try {
      if (typeof value !== "string") {
        return this.errorCode;
      }

      const parts = parseIsoDateParts(value);
      if (!parts) {
        return this.errorCode;
      }

      const today = new Date();
      const todayOrdinal = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());

      return toOrdinalDate(parts) > todayOrdinal ? null : this.errorCode;
    } catch {
      return this.errorCode;
    }
  }
}

export { FutureDateValidation };
