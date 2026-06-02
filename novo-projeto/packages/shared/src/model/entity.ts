import { v4 as uuidV4 } from "uuid";

interface EntityState {
  id?: string;
}

abstract class Entity<State extends EntityState> {
  readonly id: string;
  protected readonly props: State;

  protected constructor(props: State) {
    this.id = props.id ?? uuidV4();
    this.props = { ...props, id: this.id };
  }

  equals(entity?: Entity<EntityState>): boolean {
    return entity !== undefined && this.id === entity.id;
  }

  copy(state: Partial<State>): this {
    const EntityConstructor = this.constructor as new (state: State) => this;

    return new EntityConstructor({ ...this.props, ...state });
  }

  abstract validate(): void;
}

export { Entity };
export type { EntityState };
