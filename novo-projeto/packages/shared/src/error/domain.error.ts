class DomainError extends Error {
  statusCode = 400;

  constructor(message = "Erro de dominio") {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export { DomainError };
