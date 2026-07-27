import { Entity } from '../core/Entity.js';
import { assert, isNonEmptyString } from '../utils/validators.js';

/**
 * Member domain model.
 *
 * Represents a library member who can borrow books. Keeps track of the ids of
 * the loans currently held by this member.
 */
export class Member extends Entity {
  /**
   * @param {object} data
   * @param {string} data.name
   * @param {string} data.email
   * @param {number} [data.borrowLimit=5]
   * @param {string} [data.id]
   */
  constructor({ name, email, borrowLimit = 5, id } = {}) {
    super(id);
    assert(isNonEmptyString(name), 'Member name is required.');
    assert(isNonEmptyString(email) && email.includes('@'), 'A valid member email is required.');

    this.name = name.trim();
    this.email = email.trim();
    this.borrowLimit = borrowLimit;
    /** @type {Set<string>} ids of active loans */
    this.activeLoanIds = new Set();
  }

  get canBorrow() {
    return this.activeLoanIds.size < this.borrowLimit;
  }

  addLoan(loanId) {
    assert(this.canBorrow, `${this.name} has reached the borrow limit of ${this.borrowLimit}.`);
    this.activeLoanIds.add(loanId);
  }

  removeLoan(loanId) {
    this.activeLoanIds.delete(loanId);
  }

  describe() {
    return `${this.name} <${this.email}> (${this.activeLoanIds.size}/${this.borrowLimit} loans)`;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      borrowLimit: this.borrowLimit,
      activeLoanIds: [...this.activeLoanIds],
    };
  }
}

export default Member;
