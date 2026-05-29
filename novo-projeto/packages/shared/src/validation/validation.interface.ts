interface IValidation<T> {
  errorCode: string;
  validate(value: T): string | null;
}

export type { IValidation };
