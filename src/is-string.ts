import type { NarrowedTo } from './helpers/types';

/**
 * A function that checks if the passed parameter is a string and narrows its type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is a string, false otherwise.
 * @signature
 *    P.isString(data)
 * @example
 *    P.isString('string') //=> true
 *    P.isString(1) //=> false
 * @category Guard
 */
export function isString<T>(data: T | string): data is NarrowedTo<T, string> {
  return typeof data === 'string';
}
