import type { NarrowedTo } from './internal/types/narrowed-to';
import type { StrictFunction } from './internal/types/strict-function';

/**
 * A function that checks if the passed parameter is a Function and narrows its type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is a Function, false otherwise.
 * @signature
 *    P.isFunction(data)
 * @example
 *    P.isFunction(() => {}) //=> true
 *    P.isFunction('somethingElse') //=> false
 * @category Guard
 */
export function isFunction<T>(data: StrictFunction | T): data is NarrowedTo<T, StrictFunction> {
  return typeof data === 'function';
}
