/**
 * ID generation utilities (reusable module).
 *
 * Pure helper functions with no external dependencies. Kept separate so any
 * component can generate consistent identifiers without duplicating logic.
 */

/**
 * Generate a reasonably unique id with an optional prefix.
 * Combines a timestamp component and a random component.
 * @param {string} [prefix='id']
 * @returns {string}
 */
export function generateId(prefix = 'id') {
  const time = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${time}${random}`;
}

/**
 * Create a sequential id generator (closure-based factory).
 * Useful when deterministic, ordered ids are preferred (e.g. in tests).
 * @param {string} [prefix='seq']
 * @returns {() => string}
 */
export function createSequentialIdGenerator(prefix = 'seq') {
  let counter = 0;
  return () => {
    counter += 1;
    return `${prefix}_${String(counter).padStart(6, '0')}`;
  };
}

export default generateId;
