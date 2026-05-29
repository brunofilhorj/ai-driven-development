import {
  DomainError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "../src/index";

test("Deve expor erros de dominio com status HTTP", () => {
  expect(new DomainError("Erro").statusCode).toBe(500);
  expect(new ValidationError("Dados invalidos").statusCode).toBe(422);
  expect(new NotFoundError("Item nao encontrado").statusCode).toBe(404);
  expect(new UnauthorizedError("Acesso negado").statusCode).toBe(401);
});
