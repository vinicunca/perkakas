import type { NarrowedTo } from '../utils/types';

/**
 * A function that checks if the passed parameter is a string and narrows its type accordingly
 * @param data the variable to check
 * @signature
 *    P.isString(data)
 * @returns true if the passed input is a string, false otherwise
 * @example
 *    P.isString('string') //=> true
 *    P.isString(1) //=> false
 * @category Guard
 */
export function isString<T>(data: T | string): data is NarrowedTo<T, string> {
  return typeof data === 'string';
}
