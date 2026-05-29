import type { IValidation } from "../validation.interface";

function countDecimalPlaces(value: number): number {
  const normalizedValue = value.toString().toLowerCase();
  const [coefficient, exponentValue] = normalizedValue.split("e");
  const decimalPlaces = (coefficient?.split(".")[1] ?? "").length;
  const exponent = Number(exponentValue ?? 0);

  return Math.max(0, decimalPlaces - exponent);
}

class PrecisionValidation implements IValidation<number> {
  errorCode = "invalid_precision";

  constructor(private readonly maxDecimals: number) {}

  validate(value: number): string | null {
    return typeof value === "number" &&
      Number.isFinite(value) &&
      Number.isInteger(this.maxDecimals) &&
      this.maxDecimals >= 0 &&
      countDecimalPlaces(value) <= this.maxDecimals
      ? null
      : this.errorCode;
  }
}

export { PrecisionValidation };
