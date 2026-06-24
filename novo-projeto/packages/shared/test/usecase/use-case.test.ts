import type { UseCase } from "../../src/index";

type GreetingInput = {
  name: string;
};

type GreetingOutput = {
  message: string;
};

class CreateGreetingUseCase implements UseCase<GreetingInput, GreetingOutput> {
  async execute(input: GreetingInput): Promise<GreetingOutput> {
    return {
      message: `Olá, ${input.name}!`,
    };
  }
}

describe("UseCase", () => {
  it("deve executar um caso de uso concreto com entrada e saída tipadas", async () => {
    const useCase = new CreateGreetingUseCase();

    await expect(useCase.execute({ name: "Bruno" })).resolves.toEqual({
      message: "Olá, Bruno!",
    });
  });
});
