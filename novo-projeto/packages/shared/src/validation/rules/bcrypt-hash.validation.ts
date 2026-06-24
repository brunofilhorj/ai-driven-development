import type { IValidation } from "../validation.interface";

const BCRYPT_HASH_PATTERN = /^\$2[aby]\$(?:0[4-9]|[12]\d|3[01])\$[./A-Za-z0-9]{53}$/;

class BcryptHashValidation implements IValidation<string> {
  errorCode = "invalid_bcrypt_hash";

  validate(value: string): string | null {
    return typeof value === "string" && BCRYPT_HASH_PATTERN.test(value)
      ? null
      : this.errorCode;
  }
}

export { BcryptHashValidation };
