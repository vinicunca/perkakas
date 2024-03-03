import type { NarrowedTo } from '../utils/types';

/**
 * A function that checks if the passed parameter is a number and narrows its type accordingly
 * @param data the variable to check
 * @signature
 *    P.isNumber(data)
 * @returns true if the passed input is a number, false otherwise
 * @example
 *    P.isNumber(1) //=> true
 *    P.isNumber('notANumber') //=> false
 * @category Guard
 */
export function isNumber<T>(data: T | number): data is NarrowedTo<T, number> {
  return typeof data === 'number' && !Number.isNaN(data);
}
