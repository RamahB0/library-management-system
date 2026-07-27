/**
 * NotificationObserver - a concrete observer.
 *
 * Subscribes to library events and turns them into user-facing notifications.
 * It depends on an injected logger (dependency injection) rather than reaching
 * for a global, which keeps it testable and reusable.
 */
export class NotificationObserver {
  /**
   * @param {object} deps
   * @param {import('../utils/Logger.js').Logger} deps.logger
   */
  constructor({ logger }) {
    if (!logger) throw new Error('NotificationObserver requires a logger.');
    this.logger = logger;
    /** @type {Array<{event: string, message: string, at: Date}>} */
    this.history = [];
  }

  #record(event, message) {
    this.history.push({ event, message, at: new Date() });
    this.logger.info(message);
  }

  /**
   * Register this observer against a subject (an EventEmitter).
   * @param {import('./EventEmitter.js').EventEmitter} subject
   */
  register(subject) {
    subject.on('book:borrowed', ({ member, book }) => {
      this.#record('book:borrowed', `${member.name} borrowed "${book.title}".`);
    });
    subject.on('book:returned', ({ member, book }) => {
      this.#record('book:returned', `${member.name} returned "${book.title}".`);
    });
    subject.on('book:added', ({ book }) => {
      this.#record('book:added', `New book added to catalog: "${book.title}".`);
    });
    subject.on('member:registered', ({ member }) => {
      this.#record('member:registered', `New member registered: ${member.name}.`);
    });
  }
}

export default NotificationObserver;
