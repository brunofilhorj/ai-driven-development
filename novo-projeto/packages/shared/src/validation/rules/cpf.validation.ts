import type { IValidation } from "../validation.interface";

function calculateCpfDigit(baseDigits: number[]): number {
  const sum = baseDigits.reduce((total, digit, index) => total + digit * (baseDigits.length + 1 - index), 0);
  const remainder = (sum * 10) % 11;
  return remainder === 10 ? 0 : remainder;
}

class CpfValidation implements IValidation<string> {
  errorCode = "invalid_cpf";

  validate(value: string): string | null {
    try {
      if (typeof value !== "string") {
        return this.errorCode;
      }

      const digits = value.replace(/\D/g, "");
      if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) {
        return this.errorCode;
      }

      const numbers = digits.split("").map(Number);
      const firstDigit = calculateCpfDigit(numbers.slice(0, 9));
      const secondDigit = calculateCpfDigit([...numbers.slice(0, 9), firstDigit]);

      return firstDigit === numbers[9] && secondDigit === numbers[10] ? null : this.errorCode;
    } catch {
      return this.errorCode;
    }
  }
}

export { CpfValidation };
