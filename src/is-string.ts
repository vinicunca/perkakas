import type { NarrowedTo } from './_types';

/**
 * A function that checks if the passed parameter is a string and narrows its type accordingly
 *
 * @param data the variable to check
 * @signature
 *  isString(data)
 * @returns true if the passed input is a string, false otherwise
 * @example
 *  import { isString } from '@vinicunca/perkakas';
 *
 *  isString('string'); // => true
 *  isString(1); // => false
 * @category Guard
 */
export function isString<T>(data: T | string): data is NarrowedTo<T, string> {
  return typeof data === 'string';
}
