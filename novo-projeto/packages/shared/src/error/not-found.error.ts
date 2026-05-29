import { DomainError } from "./domain.error";

class NotFoundError extends DomainError {
  statusCode = 404;

  constructor(message = "Recurso nao encontrado") {
    super(message);
  }
}

export { NotFoundError };
