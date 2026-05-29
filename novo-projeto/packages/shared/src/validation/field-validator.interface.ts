import type { IValidation } from "./validation.interface";
import { ValidationError } from "./validation-error";

interface IFieldValidator<T = unknown> {
  fieldCode: string;
  validations: IValidation<T>[];
  validate(value: T): ValidationError[];
}

type FieldValidationConfig<T = unknown> = Pick<IFieldValidator<T>, "fieldCode" | "validations">;

class FieldValidator<T = unknown> implements IFieldValidator<T> {
  constructor(
    readonly fieldCode: string,
    readonly validations: IValidation<T>[],
  ) {}

  validate(value: T): ValidationError[] {
    return this.validations
      .map((validation) => validation.validate(value))
      .filter((errorCode): errorCode is string => errorCode !== null)
      .map((errorCode) => new ValidationError(this.fieldCode, errorCode));
  }
}

export { FieldValidator };
export type { FieldValidationConfig, IFieldValidator };
