# library-management-system

A modular **Library Management System** written in JavaScript using **ES modules**, built to demonstrate clean separation of concerns, reusable utilities, and classic design patterns in a Node.js environment.

## Highlights

- **ES modules** throughout (`"type": "module"`) for clear, explicit imports/exports.
- **Design patterns**: Factory, Strategy, and Observer.
- **Reusable utility modules**: logger, id generator, validators.
- **Interface-like abstractions** via abstract base classes (JS has no interfaces).
- **Dependency injection** through a small container / composition root for testability.

## Project structure

```
src/
  core/
    Entity.js            Abstract base entity (interface-like abstraction)
    Container.js         Dependency injection container
  models/
    Book.js              Book domain model
    Member.js            Member domain model
  factories/
    BookFactory.js       FACTORY pattern: builds books from presets
  strategies/
    searchStrategies.js  STRATEGY pattern: pluggable search behaviours
  observers/
    EventEmitter.js      OBSERVER pattern: subject / pub-sub
    NotificationObserver.js  Concrete observer (uses injected logger)
  services/
    Catalog.js           Book collection + strategy-based search
    LibraryService.js    Orchestrator + observer subject
  utils/
    Logger.js            Reusable leveled logger
    idGenerator.js       Reusable id helpers
    validators.js        Reusable validation helpers
  container.js           Composition root (wires everything via DI)
  index.js               Runnable demo
```

## Design patterns

**Factory** — `BookFactory` centralises Book creation and applies presets (reference, textbook, fiction, general) so callers don't repeat construction details.

**Strategy** — `searchStrategies` provides interchangeable `match(book, term)` implementations (title, author, genre, isbn). `Catalog.search(term, by)` selects one at call time.

**Observer** — `EventEmitter` is the subject; `LibraryService` extends it and emits events (`book:borrowed`, `book:returned`, `book:added`, `member:registered`). `NotificationObserver` subscribes and reacts.

**Dependency injection** — `Container` registers factories and resolves singletons/transients. `container.js` is the single composition root; services receive collaborators instead of constructing them, which makes them easy to test with fakes.

**Interface-like abstractions** — `Entity` and `SearchStrategy` are abstract base classes that throw on unimplemented methods, documenting the contract subclasses must fulfil.

## Requirements

- Node.js >= 18

## Run the demo

```bash
npm start
# or
node src/index.js
```

The demo builds the object graph through the DI container, adds books via the factory, registers members, performs strategy-based searches, and borrows / returns books (which fire observer notifications).

## License

MIT
