/**
 * OBSERVER PATTERN (Subject / EventEmitter)
 * -----------------------------------------
 * A minimal publish/subscribe implementation. Subjects (like the library
 * service) extend or embed an EventEmitter; observers subscribe to named
 * events and are notified when the subject emits them.
 */
export class EventEmitter {
  constructor() {
    /** @type {Map<string, Set<Function>>} */
    this.listeners = new Map();
  }

  /**
   * Subscribe to an event.
   * @param {string} event
   * @param {(payload: any) => void} handler
   * @returns {() => void} an unsubscribe function
   */
  on(event, handler) {
    if (typeof handler !== 'function') {
      throw new TypeError('Event handler must be a function.');
    }
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(handler);
    return () => this.off(event, handler);
  }

  /** Subscribe to an event for a single emission only. */
  once(event, handler) {
    const wrapper = (payload) => {
      this.off(event, wrapper);
      handler(payload);
    };
    return this.on(event, wrapper);
  }

  /** Unsubscribe a handler from an event. */
  off(event, handler) {
    this.listeners.get(event)?.delete(handler);
  }

  /**
   * Emit an event, notifying all observers. Handler errors are isolated so a
   * single failing observer does not break the others.
   * @param {string} event
   * @param {any} payload
   */
  emit(event, payload) {
    for (const handler of this.listeners.get(event) ?? []) {
      try {
        handler(payload);
      } catch (err) {
        // Deliberately swallow to keep other observers running.
        console.error(`Observer for "${event}" threw:`, err);
      }
    }
  }
}

export default EventEmitter;
