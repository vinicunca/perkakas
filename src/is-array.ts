import type { NarrowedTo } from './_types';

/**
 * A function that checks if the passed parameter is an Array and narrows its type accordingly
 * @param data the variable to check
 * @signature
 *  isArray(data)
 * @returns true if the passed input is an Array, false otherwise
 * @example
 *  import { isArray } from '@vinicunca/perkakas';
 *
 *  isArray([5]); // => true
 *  isArray([]); // => true
 *  isArray('somethingElse'); // => false
 * @category Guard
 */
export function isArray<T>(
  data: ArrayLike<unknown> | T,
): data is NarrowedTo<T, ReadonlyArray<unknown>> {
  return Array.isArray(data);
}
