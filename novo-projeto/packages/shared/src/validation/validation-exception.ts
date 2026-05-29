import { DomainError } from "../error/domain.error";
import { ValidationError } from "./validation-error";

class ValidationException extends DomainError {
  statusCode = 422;

  constructor(
    readonly errors: ValidationError[],
    message = "Erro de validacao",
  ) {
    super(message);
  }
}

export { ValidationException };
