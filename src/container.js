import { Container } from './core/Container.js';
import { Logger, LogLevel } from './utils/Logger.js';
import { Catalog } from './services/Catalog.js';
import { LibraryService } from './services/LibraryService.js';
import { NotificationObserver } from './observers/NotificationObserver.js';
import { searchStrategies } from './strategies/searchStrategies.js';

/**
 * Composition root.
 *
 * This is the single place where concrete implementations are wired together.
 * Every service declares its dependencies and receives them from the
 * container, so nothing constructs its own collaborators. Swapping any
 * implementation (e.g. a fake logger in tests) only requires changing a
 * registration here.
 *
 * @param {object} [overrides] optional registration overrides for testing
 * @returns {Container}
 */
export function buildContainer(overrides = {}) {
  const container = new Container();

  container.register('logger', () => new Logger({ level: LogLevel.DEBUG, name: 'library' }));
  container.registerValue('searchStrategies', searchStrategies);

  container.register('catalog', (c) => new Catalog({
    strategies: c.resolve('searchStrategies'),
    logger: c.resolve('logger').child('catalog'),
  }));

  container.register('libraryService', (c) => new LibraryService({
    catalog: c.resolve('catalog'),
    logger: c.resolve('logger').child('service'),
  }));

  container.register('notificationObserver', (c) => new NotificationObserver({
    logger: c.resolve('logger').child('notify'),
  }));

  // Apply any test/runtime overrides last so they win.
  for (const [name, factory] of Object.entries(overrides)) {
    container.register(name, factory);
  }

  return container;
}

export default buildContainer;
