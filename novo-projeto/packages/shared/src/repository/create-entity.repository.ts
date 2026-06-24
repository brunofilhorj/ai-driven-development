interface CreateEntityRepository<Entity, CreateInput = Entity> {
  create(input: CreateInput): Promise<Entity>;
}

export type { CreateEntityRepository };
