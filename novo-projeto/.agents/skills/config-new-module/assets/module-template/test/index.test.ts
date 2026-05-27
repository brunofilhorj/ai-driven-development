import { somar } from "../src/index";

test("Deve somar dois numeros corretamente", () => {
  const resultado = somar(2, 4);
  expect(resultado).toBe(6);
});
