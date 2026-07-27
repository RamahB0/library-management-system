import { EventEmitter } from '../observers/EventEmitter.js';
import { generateId } from '../utils/idGenerator.js';
import { assert } from '../utils/validators.js';

/**
 * LibraryService - the application's core orchestrator.
 *
 * - Acts as the SUBJECT in the OBSERVER pattern (extends EventEmitter).
 * - Receives its collaborators through DEPENDENCY INJECTION (catalog, logger).
 * - Coordinates domain models (Book, Member) and loan bookkeeping.
 */
export class LibraryService extends EventEmitter {
  /**
   * @param {object} deps
   * @param {import('./Catalog.js').Catalog} deps.catalog
   * @param {import('../utils/Logger.js').Logger} deps.logger
   */
  constructor({ catalog, logger }) {
    super();
    assert(!!catalog, 'LibraryService requires a catalog dependency.');
    assert(!!logger, 'LibraryService requires a logger dependency.');
    this.catalog = catalog;
    this.logger = logger;
    /** @type {Map<string, import('../models/Member.js').Member>} */
    this.members = new Map();
    /** @type {Map<string, {id: string, memberId: string, bookId: string, borrowedAt: Date, returnedAt: Date|null}>} */
    this.loans = new Map();
  }

  addBook(book) {
    this.catalog.add(book);
    this.emit('book:added', { book });
    return book;
  }

  registerMember(member) {
    this.members.set(member.id, member);
    this.emit('member:registered', { member });
    return member;
  }

  /**
   * Borrow a book: updates the copy count, the member, and records a loan.
   * Emits 'book:borrowed'.
   */
  borrow(memberId, bookId) {
    const member = this.members.get(memberId);
    const book = this.catalog.getById(bookId);
    assert(!!member, `Unknown member: ${memberId}`);
    assert(!!book, `Unknown book: ${bookId}`);

    book.checkoutCopy();
    const loan = { id: generateId('loan'), memberId, bookId, borrowedAt: new Date(), returnedAt: null };
    member.addLoan(loan.id);
    this.loans.set(loan.id, loan);

    this.emit('book:borrowed', { member, book, loan });
    return loan;
  }

  /**
   * Return a previously borrowed book. Emits 'book:returned'.
   */
  returnBook(loanId) {
    const loan = this.loans.get(loanId);
    assert(!!loan, `Unknown loan: ${loanId}`);
    assert(!loan.returnedAt, 'This loan has already been returned.');

    const member = this.members.get(loan.memberId);
    const book = this.catalog.getById(loan.bookId);
    book.returnCopy();
    member.removeLoan(loan.id);
    loan.returnedAt = new Date();

    this.emit('book:returned', { member, book, loan });
    return loan;
  }

  activeLoans() {
    return [...this.loans.values()].filter((loan) => !loan.returnedAt);
  }
}

export default LibraryService;
