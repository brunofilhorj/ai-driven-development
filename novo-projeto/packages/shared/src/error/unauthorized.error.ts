import { DomainError } from "./domain.error";

class UnauthorizedError extends DomainError {
  statusCode = 401;

  constructor(message = "Nao autorizado") {
    super(message);
  }
}

export { UnauthorizedError };
