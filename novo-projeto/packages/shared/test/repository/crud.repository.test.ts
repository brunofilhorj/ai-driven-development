import type {
  CrudRepository,
  PaginatedResult,
  PaginationInput,
} from "../../src/index";

interface User {
  id: string;
  name: string;
  email: string;
}

type CreateUserInput = Omit<User, "id">;

interface UpdateUserInput {
  id: string;
  name?: string;
  email?: string;
}

interface UserPredicate {
  name?: string;
  email?: string;
}

class InMemoryUserRepository
  implements
    CrudRepository<
      User,
      UserPredicate,
      CreateUserInput,
      UpdateUserInput,
      string
    >
{
  private readonly users = new Map<string, User>();
  private nextId = 1;

  async create(input: CreateUserInput): Promise<User> {
    const user: User = {
      id: String(this.nextId++),
      ...input,
    };

    this.users.set(user.id, user);

    return user;
  }

  async update(input: UpdateUserInput): Promise<User> {
    const currentUser = this.users.get(input.id);

    if (!currentUser) {
      throw new Error("Usuário não encontrado");
    }

    const updatedUser: User = {
      ...currentUser,
      ...input,
    };

    this.users.set(updatedUser.id, updatedUser);

    return updatedUser;
  }

  async delete(id: string): Promise<void> {
    this.users.delete(id);
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) ?? null;
  }

  async findWithPredicate(
    predicate: UserPredicate,
    pagination: PaginationInput,
  ): Promise<PaginatedResult<User>> {
    const filteredUsers = [...this.users.values()].filter((user) => {
      const matchesName =
        predicate.name === undefined ||
        user.name.toLowerCase().includes(predicate.name.toLowerCase());
      const matchesEmail =
        predicate.email === undefined ||
        user.email.toLowerCase().includes(predicate.email.toLowerCase());

      return matchesName && matchesEmail;
    });

    const startIndex = (pagination.page - 1) * pagination.perPage;
    const items = filteredUsers.slice(
      startIndex,
      startIndex + pagination.perPage,
    );

    return {
      items,
      page: pagination.page,
      perPage: pagination.perPage,
      totalItems: filteredUsers.length,
      totalPages: Math.ceil(filteredUsers.length / pagination.perPage),
    };
  }
}

describe("CrudRepository", () => {
  it("deve executar um CRUD completo com uma implementação em memória", async () => {
    const repository = new InMemoryUserRepository();

    const createdUser = await repository.create({
      name: "Bruno",
      email: "bruno@example.com",
    });

    expect(createdUser).toEqual({
      id: "1",
      name: "Bruno",
      email: "bruno@example.com",
    });
    await expect(repository.findById(createdUser.id)).resolves.toEqual(
      createdUser,
    );

    const updatedUser = await repository.update({
      id: createdUser.id,
      name: "Bruno Silva",
    });

    expect(updatedUser).toEqual({
      id: "1",
      name: "Bruno Silva",
      email: "bruno@example.com",
    });

    await repository.delete(createdUser.id);

    await expect(repository.findById(createdUser.id)).resolves.toBeNull();
  });

  it("deve filtrar e paginar entidades usando um predicado genérico", async () => {
    const repository = new InMemoryUserRepository();

    await repository.create({
      name: "Ana Souza",
      email: "ana.souza@example.com",
    });
    await repository.create({
      name: "Ana Lima",
      email: "ana.lima@example.com",
    });
    await repository.create({
      name: "Carlos Lima",
      email: "carlos@example.com",
    });

    await expect(
      repository.findWithPredicate(
        { name: "ana" },
        { page: 2, perPage: 1 },
      ),
    ).resolves.toEqual({
      items: [
        {
          id: "2",
          name: "Ana Lima",
          email: "ana.lima@example.com",
        },
      ],
      page: 2,
      perPage: 1,
      totalItems: 2,
      totalPages: 2,
    });
  });
});
