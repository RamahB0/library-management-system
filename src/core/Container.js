/**
 * DEPENDENCY INJECTION CONTAINER
 * ------------------------------
 * A tiny service locator / DI container. Services are registered with a
 * factory function that receives the container, so a service can resolve its
 * own dependencies. Singletons are cached; transients are created per resolve.
 *
 * This lets components declare what they need without constructing their own
 * dependencies, which greatly improves testability (swap real services for
 * fakes in tests).
 */
export class Container {
  constructor() {
    /** @type {Map<string, {factory: Function, singleton: boolean}>} */
    this.registrations = new Map();
    /** @type {Map<string, any>} */
    this.instances = new Map();
  }

  /**
   * Register a service factory.
   * @param {string} name
   * @param {(container: Container) => any} factory
   * @param {{singleton?: boolean}} [options]
   * @returns {Container} this (for chaining)
   */
  register(name, factory, { singleton = true } = {}) {
    if (typeof factory !== 'function') {
      throw new TypeError(`Factory for "${name}" must be a function.`);
    }
    this.registrations.set(name, { factory, singleton });
    return this;
  }

  /** Register an already-created value as a singleton. */
  registerValue(name, value) {
    this.registrations.set(name, { factory: () => value, singleton: true });
    this.instances.set(name, value);
    return this;
  }

  /**
   * Resolve a service by name, constructing it (and caching if singleton).
   * @param {string} name
   * @returns {any}
   */
  resolve(name) {
    const registration = this.registrations.get(name);
    if (!registration) {
      throw new Error(`No service registered under "${name}".`);
    }
    if (registration.singleton && this.instances.has(name)) {
      return this.instances.get(name);
    }
    const instance = registration.factory(this);
    if (registration.singleton) {
      this.instances.set(name, instance);
    }
    return instance;
  }

  has(name) {
    return this.registrations.has(name);
  }
}

export default Container;
