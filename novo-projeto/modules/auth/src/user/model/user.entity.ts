import {
  BcryptHashValidation,
  EmailValidation,
  Entity,
  type EntityState,
  MaxLengthValidation,
  MinLengthValidation,
  PersonNameValidation,
  RequiredValidation,
  UuidValidation,
  Validator,
} from "@poupig/shared";

interface UserState extends EntityState {
  name: string;
  email: string;
  password: string;
}

class User extends Entity<UserState> {
  constructor(props: UserState) {
    super(props);
  }

  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }

  validate(): void {
    new Validator([
      {
        fieldCode: "user.id",
        validations: [new UuidValidation()],
      },
      {
        fieldCode: "user.name",
        validations: [
          new RequiredValidation(),
          new MinLengthValidation(3),
          new MaxLengthValidation(80),
          new PersonNameValidation(),
        ],
      },
      {
        fieldCode: "user.email",
        validations: [new RequiredValidation(), new EmailValidation()],
      },
      {
        fieldCode: "user.password",
        validations: [new BcryptHashValidation()],
      },
    ]).validate({ ...this.props });
  }
}

export { User };
export type { UserState };
