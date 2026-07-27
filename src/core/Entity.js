import { generateId } from '../utils/idGenerator.js';

/**
 * Entity - abstract base class for all domain entities.
 *
 * JavaScript has no interfaces or abstract classes, so we emulate them:
 *   - the constructor prevents direct instantiation of Entity itself, and
 *   - abstract methods throw until a subclass overrides them.
 *
 * This gives us an interface-like abstraction that subclasses must honour.
 */
export class Entity {
  /**
   * @param {string} [id] Optional pre-existing id; generated when omitted.
   */
  constructor(id) {
    if (new.target === Entity) {
      throw new Error('Entity is abstract and cannot be instantiated directly.');
    }
    this.id = id ?? generateId(new.target.name.toLowerCase());
    this.createdAt = new Date();
  }

  /**
   * Abstract: subclasses must return a plain serialisable object.
   * @returns {object}
   */
  toJSON() {
    throw new Error(`${this.constructor.name} must implement toJSON().`);
  }

  /**
   * Human-readable summary. Subclasses are encouraged to override.
   * @returns {string}
   */
  describe() {
    return `${this.constructor.name}(${this.id})`;
  }
}

export default Entity;
