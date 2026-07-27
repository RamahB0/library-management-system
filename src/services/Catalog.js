import { searchStrategies } from '../strategies/searchStrategies.js';

/**
 * Catalog - manages the collection of books and searching over it.
 *
 * Demonstrates the STRATEGY pattern: searching is delegated to an injected
 * strategy registry, and the active strategy can be swapped at call time.
 */
export class Catalog {
  /**
   * @param {object} [deps]
   * @param {object} [deps.strategies] map of name -> SearchStrategy
   * @param {import('../utils/Logger.js').Logger} [deps.logger]
   */
  constructor({ strategies = searchStrategies, logger } = {}) {
    /** @type {Map<string, import('../models/Book.js').Book>} */
    this.books = new Map();
    this.strategies = strategies;
    this.logger = logger;
  }

  add(book) {
    this.books.set(book.id, book);
    this.logger?.debug(`Catalog added ${book.describe()}`);
    return book;
  }

  getById(id) {
    return this.books.get(id) ?? null;
  }

  all() {
    return [...this.books.values()];
  }

  /**
   * Search using a named strategy (STRATEGY pattern in action).
   * @param {string} term
   * @param {string} [by='title'] strategy name
   * @returns {import('../models/Book.js').Book[]}
   */
  search(term, by = 'title') {
    const strategy = this.strategies[by];
    if (!strategy) {
      throw new Error(`Unknown search strategy: "${by}". Available: ${Object.keys(this.strategies).join(', ')}`);
    }
    return this.all().filter((book) => strategy.match(book, term));
  }

  get size() {
    return this.books.size;
  }
}

export default Catalog;
