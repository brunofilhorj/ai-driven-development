import type { CreateEntityRepository } from "./create-entity.repository";
import type { DeleteEntityRepository } from "./delete-entity.repository";
import type { FindByIdRepository } from "./find-by-id.repository";
import type { FindWithPredicateRepository } from "./find-with-predicate.repository";
import type { UpdateEntityRepository } from "./update-entity.repository";

interface CrudRepository<
  Entity,
  Predicate = unknown,
  CreateInput = Entity,
  UpdateInput = Entity,
  EntityId = string,
> extends CreateEntityRepository<Entity, CreateInput>,
    UpdateEntityRepository<Entity, UpdateInput>,
    DeleteEntityRepository<EntityId>,
    FindByIdRepository<Entity, EntityId>,
    FindWithPredicateRepository<Entity, Predicate> {}

export type { CrudRepository };
