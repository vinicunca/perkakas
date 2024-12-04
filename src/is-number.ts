import type { NarrowedTo } from './internal/types/narrowed-to';

/**
 * A function that checks if the passed parameter is a number and narrows its
 * type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is a number, false otherwise.
 * @signature
 *    P.isNumber(data)
 * @example
 *    P.isNumber(1); // => true
 *    P.isNumber(1n); // => false
 *    P.isNumber('notANumber'); // => false
 * @category Guard
 */
export function isNumber<T>(data: number | T): data is NarrowedTo<T, number> {
  return typeof data === 'number' && !Number.isNaN(data);
}
