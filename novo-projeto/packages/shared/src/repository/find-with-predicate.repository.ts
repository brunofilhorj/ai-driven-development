interface PaginationInput {
  page: number;
  perPage: number;
}

interface PaginatedResult<Entity> {
  items: Entity[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

interface FindWithPredicateRepository<Entity, Predicate = unknown> {
  findWithPredicate(
    predicate: Predicate,
    pagination: PaginationInput,
  ): Promise<PaginatedResult<Entity>>;
}

export type {
  FindWithPredicateRepository,
  PaginatedResult,
  PaginationInput,
};
