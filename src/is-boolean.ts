import type { NarrowedTo } from './internal/types/narrowed-to';

/**
 * A function that checks if the passed parameter is a boolean and narrows its type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is a boolean, false otherwise.
 * @signature
 *    P.isBoolean(data)
 * @example
 *    P.isBoolean(true) //=> true
 *    P.isBoolean(false) //=> true
 *    P.isBoolean('somethingElse') //=> false
 * @category Guard
 */
export function isBoolean<T>(
  data: boolean | T,
): data is NarrowedTo<T, boolean> {
  return typeof data === 'boolean';
}
