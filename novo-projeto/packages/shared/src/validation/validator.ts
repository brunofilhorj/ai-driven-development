import {
  FieldValidator,
  type FieldValidationConfig,
  type IFieldValidator,
} from "./field-validator.interface";
import { ValidationException } from "./validation-exception";

class Validator {
  private readonly fieldValidators: IFieldValidator[];

  constructor(fieldValidators: Array<FieldValidationConfig | IFieldValidator>) {
    this.fieldValidators = fieldValidators.map((fieldValidator) => {
      if (this.isFieldValidator(fieldValidator)) {
        return fieldValidator;
      }

      return new FieldValidator(fieldValidator.fieldCode, fieldValidator.validations);
    });
  }

  validate(data: Record<string, unknown>): void {
    const errors = this.fieldValidators.flatMap((fieldValidator) => {
      const value = this.getFieldValue(data, fieldValidator.fieldCode);
      return fieldValidator.validate(value);
    });

    if (errors.length > 0) {
      throw new ValidationException(errors);
    }
  }

  private getFieldValue(data: Record<string, unknown>, fieldCode: string): unknown {
    if (fieldCode in data) {
      return data[fieldCode];
    }

    const pathValue = fieldCode
      .split(".")
      .reduce<unknown>((current, key) => {
        if (current && typeof current === "object" && key in current) {
          return (current as Record<string, unknown>)[key];
        }

        return undefined;
      }, data);

    if (pathValue !== undefined) {
      return pathValue;
    }

    const fieldCodeParts = fieldCode.split(".");
    return data[fieldCodeParts[fieldCodeParts.length - 1] ?? fieldCode];
  }

  private isFieldValidator(
    fieldValidator: FieldValidationConfig | IFieldValidator,
  ): fieldValidator is IFieldValidator {
    return typeof (fieldValidator as IFieldValidator).validate === "function";
  }
}

export { Validator };
