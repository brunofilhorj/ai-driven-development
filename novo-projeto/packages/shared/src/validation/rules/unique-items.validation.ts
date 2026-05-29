import type { IValidation } from "../validation.interface";

class UniqueItemsValidation implements IValidation<unknown[]> {
  errorCode = "duplicate_items";

  validate(value: unknown[]): string | null {
    try {
      if (!Array.isArray(value)) {
        return this.errorCode;
      }

      const seenItems = new Set<string | undefined>();
      for (const item of value) {
        const serializedItem = JSON.stringify(item);
        if (seenItems.has(serializedItem)) {
          return this.errorCode;
        }

        seenItems.add(serializedItem);
      }

      return null;
    } catch {
      return this.errorCode;
    }
  }
}

export { UniqueItemsValidation };
