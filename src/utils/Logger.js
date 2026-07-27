/**
 * Logger utility (reusable module).
 *
 * A tiny, dependency-free logger with log levels. It is written as a class so
 * that different instances can be configured independently and injected where
 * needed (dependency injection friendly).
 */

export const LogLevel = Object.freeze({
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
});

const LEVEL_LABEL = Object.freeze({
  0: 'DEBUG',
  1: 'INFO',
  2: 'WARN',
  3: 'ERROR',
});

export class Logger {
  /**
   * @param {object} [options]
   * @param {number} [options.level=LogLevel.INFO] Minimum level to output.
   * @param {string} [options.name='app'] A name/prefix for the logger.
   * @param {{log: Function}} [options.sink=console] Where to write output.
   */
  constructor({ level = LogLevel.INFO, name = 'app', sink = console } = {}) {
    this.level = level;
    this.name = name;
    this.sink = sink;
  }

  #write(level, message, meta) {
    if (level < this.level) return;
    const timestamp = new Date().toISOString();
    const label = LEVEL_LABEL[level];
    const line = `[${timestamp}] [${label}] [${this.name}] ${message}`;
    if (meta !== undefined) {
      this.sink.log(line, meta);
    } else {
      this.sink.log(line);
    }
  }

  debug(message, meta) {
    this.#write(LogLevel.DEBUG, message, meta);
  }

  info(message, meta) {
    this.#write(LogLevel.INFO, message, meta);
  }

  warn(message, meta) {
    this.#write(LogLevel.WARN, message, meta);
  }

  error(message, meta) {
    this.#write(LogLevel.ERROR, message, meta);
  }

  /**
   * Create a child logger that shares configuration but has its own name.
   * @param {string} name
   * @returns {Logger}
   */
  child(name) {
    return new Logger({ level: this.level, name: `${this.name}:${name}`, sink: this.sink });
  }
}

export default Logger;
