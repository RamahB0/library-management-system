import { Book } from '../models/Book.js';

/**
 * FACTORY PATTERN
 * ---------------
 * BookFactory centralises the creation of Book instances. It knows how to
 * apply sensible defaults for different "kinds" of books (e.g. reference books
 * cannot be borrowed for long, textbooks have several copies) without callers
 * needing to know those construction details.
 */

const PRESETS = Object.freeze({
  reference: { genre: 'reference', totalCopies: 1 },
  textbook: { genre: 'textbook', totalCopies: 5 },
  fiction: { genre: 'fiction', totalCopies: 3 },
  general: { genre: 'general', totalCopies: 1 },
});

export class BookFactory {
  /**
   * Create a Book from a "kind" preset merged with the supplied data.
   * @param {keyof typeof PRESETS} kind
   * @param {object} data - at least { title, author, isbn }
   * @returns {Book}
   */
  static create(kind = 'general', data = {}) {
    const preset = PRESETS[kind] ?? PRESETS.general;
    return new Book({ ...preset, ...data });
  }

  /**
   * Rehydrate a Book from a plain object (e.g. loaded from storage).
   * @param {object} plain
   * @returns {Book}
   */
  static fromJSON(plain) {
    const book = new Book({
      id: plain.id,
      title: plain.title,
      author: plain.author,
      isbn: plain.isbn,
      genre: plain.genre,
      totalCopies: plain.totalCopies,
    });
    if (typeof plain.availableCopies === 'number') {
      book.availableCopies = plain.availableCopies;
    }
    return book;
  }

  /** List the available factory presets. */
  static kinds() {
    return Object.keys(PRESETS);
  }
}

export default BookFactory;
