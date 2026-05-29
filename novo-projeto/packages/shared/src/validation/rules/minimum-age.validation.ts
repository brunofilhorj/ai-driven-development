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

function calculateAge(parts: { year: number; month: number; day: number }): number {
  const today = new Date();
  let age = today.getUTCFullYear() - parts.year;
  const monthDifference = today.getUTCMonth() + 1 - parts.month;

  if (monthDifference < 0 || (monthDifference === 0 && today.getUTCDate() < parts.day)) {
    age -= 1;
  }

  return age;
}

class MinimumAgeValidation implements IValidation<string> {
  errorCode = "minimum_age";

  constructor(private readonly minYears: number) {}

  validate(value: string): string | null {
    try {
      if (typeof value !== "string" || !Number.isFinite(this.minYears) || this.minYears < 0) {
        return this.errorCode;
      }

      const parts = parseIsoDateParts(value);
      return parts && calculateAge(parts) >= this.minYears ? null : this.errorCode;
    } catch {
      return this.errorCode;
    }
  }
}

export { MinimumAgeValidation };
