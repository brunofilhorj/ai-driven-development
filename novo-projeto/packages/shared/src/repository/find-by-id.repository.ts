interface FindByIdRepository<Entity, EntityId = string> {
  findById(id: EntityId): Promise<Entity | null>;
}

export type { FindByIdRepository };
