import { buildContainer } from './container.js';
import { BookFactory } from './factories/BookFactory.js';
import { Member } from './models/Member.js';

/**
 * Demo / entry point.
 *
 * Wires everything through the DI container and exercises each pattern:
 *   - FACTORY:   BookFactory builds books from presets.
 *   - OBSERVER:  NotificationObserver reacts to library events.
 *   - STRATEGY:  Catalog.search switches search behaviour by name.
 *   - DI:        every collaborator is resolved from the container.
 */
function main() {
  const container = buildContainer();

  const library = container.resolve('libraryService');
  const notifications = container.resolve('notificationObserver');

  // OBSERVER: subscribe the notifier to library events.
  notifications.register(library);

  // FACTORY: create books using presets.
  const books = [
    BookFactory.create('fiction', { title: 'Dune', author: 'Frank Herbert', isbn: '9780441013593' }),
    BookFactory.create('textbook', { title: 'Clean Code', author: 'Robert C. Martin', isbn: '9780132350884' }),
    BookFactory.create('reference', { title: 'The C Programming Language', author: 'Kernighan & Ritchie', isbn: '9780131103627' }),
    BookFactory.create('fiction', { title: 'The Hobbit', author: 'J.R.R. Tolkien', isbn: '9780547928227' }),
  ];
  books.forEach((book) => library.addBook(book));

  // Register a couple of members.
  const alice = library.registerMember(new Member({ name: 'Alice', email: 'alice@example.com' }));
  const bob = library.registerMember(new Member({ name: 'Bob', email: 'bob@example.com' }));

  // STRATEGY: search the catalog different ways.
  console.log('\n--- Search demo ---');
  console.log('By title "code":', library.catalog.search('code', 'title').map((b) => b.title));
  console.log('By author "tolkien":', library.catalog.search('tolkien', 'author').map((b) => b.title));
  console.log('By genre "fiction":', library.catalog.search('fiction', 'genre').map((b) => b.title));

  // Borrow + return (triggers OBSERVER notifications).
  console.log('\n--- Loan demo ---');
  const loan1 = library.borrow(alice.id, books[0].id);
  const loan2 = library.borrow(bob.id, books[1].id);
  library.returnBook(loan1.id);

  console.log('\nActive loans:', library.activeLoans().length);
  console.log('Notifications recorded:', notifications.history.length);
  console.log('Catalog size:', library.catalog.size);

  void loan2;
}

main();
