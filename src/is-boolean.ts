import type { NarrowedTo } from './_types';

/**
 * A function that checks if the passed parameter is a boolean and narrows its type accordingly
 * @param data the variable to check
 * @signature
 *    isBoolean(data)
 * @returns true if the passed input is a boolean, false otherwise
 * @example
 *    isBoolean(true) //=> true
 *    isBoolean(false) //=> true
 *    isBoolean('somethingElse') //=> false
 * @category Guard
 */
export function isBoolean<T>(
  data: T | boolean,
): data is NarrowedTo<T, boolean> {
  return typeof data === 'boolean';
}
