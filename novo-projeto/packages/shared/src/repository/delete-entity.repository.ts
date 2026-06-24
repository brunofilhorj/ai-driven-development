interface DeleteEntityRepository<EntityId = string> {
  delete(id: EntityId): Promise<void>;
}

export type { DeleteEntityRepository };
