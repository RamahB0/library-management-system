/**
 * Validation utilities (reusable module).
 *
 * Small, composable, pure validation helpers. Throwing helpers are provided
 * for guard-style checks used by constructors and services.
 */

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}

/**
 * Very small ISBN sanity check (accepts ISBN-10 or ISBN-13 digit counts,
 * ignoring separators). Not a full checksum validation.
 * @param {string} value
 * @returns {boolean}
 */
export function isValidIsbn(value) {
  if (typeof value !== 'string') return false;
  const digits = value.replace(/[-\s]/g, '');
  return /^[0-9]{10}$/.test(digits) || /^[0-9]{13}$/.test(digits);
}

/**
 * Guard helper: throws a ValidationError when the condition is false.
 * @param {boolean} condition
 * @param {string} message
 */
export function assert(condition, message) {
  if (!condition) {
    throw new ValidationError(message);
  }
}

export default {
  ValidationError,
  isNonEmptyString,
  isPositiveInteger,
  isValidIsbn,
  assert,
};
