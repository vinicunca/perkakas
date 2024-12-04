import type { NarrowedTo } from './internal/types/narrowed-to';

/**
 * A function that checks if the passed parameter is an Array and narrows its type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is an Array, false otherwise.
 * @signature
 *    P.isArray(data)
 * @example
 *    P.isArray([5]) //=> true
 *    P.isArray([]) //=> true
 *    P.isArray('somethingElse') //=> false
 * @category Guard
 */
export function isArray<T>(
  data: ArrayLike<unknown> | T,
): data is NarrowedTo<T, ReadonlyArray<unknown>> {
  return Array.isArray(data);
}
