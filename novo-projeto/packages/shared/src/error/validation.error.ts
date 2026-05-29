import { DomainError } from "./domain.error";

class ValidationError extends DomainError {
  statusCode = 422;

  constructor(message = "Erro de validacao") {
    super(message);
  }
}

export { ValidationError };
