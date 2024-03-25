/**
 * A function that checks if the passed parameter is not `null` and narrows its type accordingly.
 * Notice that `undefined` is not null!
 * @param data the variable to check
 * @signature
 *    isNonNull(data)
 * @returns true if the passed input is defined, false otherwise
 * @example
 *    isNonNull('string') //=> true
 *    isNonNull(null) //=> false
 *    isNonNull(undefined) //=> true
 * @category Guard
 */
export function isNonNull<T>(data: T | null): data is T {
  return data !== null;
}
