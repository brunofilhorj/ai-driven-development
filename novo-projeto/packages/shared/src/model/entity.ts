import { v4 as uuidV4 } from "uuid";

interface EntityState {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

abstract class Entity<State extends EntityState> {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date | null;
  protected readonly props: State;

  protected constructor(props: State) {
    const createdAt = props.createdAt ?? new Date();

    this.id = props.id ?? uuidV4();
    this.createdAt = createdAt;
    this.updatedAt = props.updatedAt ?? createdAt;
    this.deletedAt = props.deletedAt ?? null;
    this.props = {
      ...props,
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }

  equals(entity?: Entity<EntityState>): boolean {
    return entity !== undefined && this.id === entity.id;
  }

  clone(state: Partial<State>): this {
    const EntityConstructor = this.constructor as new (state: State) => this;

    return new EntityConstructor({
      ...this.props,
      ...state,
      updatedAt: new Date(),
    });
  }

  copy(state: Partial<State>): this {
    return this.clone(state);
  }

  abstract validate(): void;
}

export { Entity };
export type { EntityState };
