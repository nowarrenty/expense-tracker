import { Id } from "../Budgeting/model/types";
import { idGenerator } from "../utils/id-generator";

/**
 * Abstract base class for Entities
 */
export abstract class Entity {
  readonly id: Id;

  constructor(id?: Id) {
    this.id = id || idGenerator();
  }

  equals<T extends Entity>(entity: T): boolean {
    if (entity === null || entity === null) {
      return false;
    }
    return entity.id === this.id ? true : false;
  }
}
