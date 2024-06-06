/**
 * A function that checks if the passed parameter is truthy and narrows its type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is truthy, false otherwise.
 * @signature
 *    P.isTruthy(data)
 * @example
 *    P.isTruthy('somethingElse') //=> true
 *    P.isTruthy(null) //=> false
 *    P.isTruthy(undefined) //=> false
 *    P.isTruthy(false) //=> false
 *    P.isTruthy(0) //=> false
 *    P.isTruthy('') //=> false
 * @category Guard
 */

export function isTruthy<T>(
  data: T,
): data is Exclude<T, '' | 0 | false | null | undefined> {
  return Boolean(data);
}
