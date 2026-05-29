import type { IValidation } from "../validation.interface";

function calculateCnpjDigit(baseDigits: number[]): number {
  const weights = baseDigits.length === 12
    ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const sum = baseDigits.reduce((total, digit, index) => total + digit * (weights[index] ?? 0), 0);
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

class CnpjValidation implements IValidation<string> {
  errorCode = "invalid_cnpj";

  validate(value: string): string | null {
    try {
      if (typeof value !== "string") {
        return this.errorCode;
      }

      const digits = value.replace(/\D/g, "");
      if (digits.length !== 14 || /^(\d)\1{13}$/.test(digits)) {
        return this.errorCode;
      }

      const numbers = digits.split("").map(Number);
      const firstDigit = calculateCnpjDigit(numbers.slice(0, 12));
      const secondDigit = calculateCnpjDigit([...numbers.slice(0, 12), firstDigit]);

      return firstDigit === numbers[12] && secondDigit === numbers[13] ? null : this.errorCode;
    } catch {
      return this.errorCode;
    }
  }
}

export { CnpjValidation };
