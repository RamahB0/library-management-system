import { Entity } from '../core/Entity.js';
import { assert, isNonEmptyString, isPositiveInteger, isValidIsbn } from '../utils/validators.js';

/**
 * Book domain model.
 *
 * Represents a title in the catalog. A single Book can have multiple physical
 * copies, tracked with totalCopies / availableCopies.
 */
export class Book extends Entity {
  /**
   * @param {object} data
   * @param {string} data.title
   * @param {string} data.author
   * @param {string} data.isbn
   * @param {number} [data.totalCopies=1]
   * @param {string} [data.genre='general']
   * @param {string} [data.id]
   */
  constructor({ title, author, isbn, totalCopies = 1, genre = 'general', id } = {}) {
    super(id);
    assert(isNonEmptyString(title), 'Book title is required.');
    assert(isNonEmptyString(author), 'Book author is required.');
    assert(isValidIsbn(isbn), 'A valid ISBN (10 or 13 digits) is required.');
    assert(isPositiveInteger(totalCopies), 'totalCopies must be a positive integer.');

    this.title = title.trim();
    this.author = author.trim();
    this.isbn = isbn.trim();
    this.genre = genre;
    this.totalCopies = totalCopies;
    this.availableCopies = totalCopies;
  }

  get isAvailable() {
    return this.availableCopies > 0;
  }

  /** Reserve one copy for a borrow. */
  checkoutCopy() {
    assert(this.isAvailable, `No available copies of "${this.title}".`);
    this.availableCopies -= 1;
  }

  /** Return one copy to the shelf. */
  returnCopy() {
    assert(this.availableCopies < this.totalCopies, `All copies of "${this.title}" are already returned.`);
    this.availableCopies += 1;
  }

  describe() {
    return `"${this.title}" by ${this.author} [${this.availableCopies}/${this.totalCopies} available]`;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      author: this.author,
      isbn: this.isbn,
      genre: this.genre,
      totalCopies: this.totalCopies,
      availableCopies: this.availableCopies,
    };
  }
}

export default Book;
