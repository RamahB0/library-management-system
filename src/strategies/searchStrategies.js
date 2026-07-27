/**
 * STRATEGY PATTERN
 * ----------------
 * A search strategy is any object exposing a `match(book, term)` method.
 * The catalog is configured with a strategy and delegates matching to it,
 * so new search behaviours can be added without touching the catalog.
 *
 * This is the "interface-like abstraction": SearchStrategy documents the
 * contract; concrete strategies implement it.
 */

/**
 * Abstract base documenting the strategy contract.
 */
export class SearchStrategy {
  /**
   * @param {import('../models/Book.js').Book} _book
   * @param {string} _term
   * @returns {boolean}
   */
  match(_book, _term) {
    throw new Error('SearchStrategy subclasses must implement match().');
  }
}

const normalize = (value) => String(value ?? '').toLowerCase().trim();

export class TitleSearchStrategy extends SearchStrategy {
  match(book, term) {
    return normalize(book.title).includes(normalize(term));
  }
}

export class AuthorSearchStrategy extends SearchStrategy {
  match(book, term) {
    return normalize(book.author).includes(normalize(term));
  }
}

export class GenreSearchStrategy extends SearchStrategy {
  match(book, term) {
    return normalize(book.genre) === normalize(term);
  }
}

export class IsbnSearchStrategy extends SearchStrategy {
  match(book, term) {
    return normalize(book.isbn) === normalize(term);
  }
}

/** Registry so strategies can be selected by name (used with the catalog). */
export const searchStrategies = Object.freeze({
  title: new TitleSearchStrategy(),
  author: new AuthorSearchStrategy(),
  genre: new GenreSearchStrategy(),
  isbn: new IsbnSearchStrategy(),
});

export default searchStrategies;
