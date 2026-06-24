interface UpdateEntityRepository<Entity, UpdateInput = Entity> {
  update(input: UpdateInput): Promise<Entity>;
}

export type { UpdateEntityRepository };
