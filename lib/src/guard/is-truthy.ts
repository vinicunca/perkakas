/**
 * A function that checks if the passed parameter is truthy and narrows its type accordingly
 * @param data the variable to check
 * @signature
 *    P.isTruthy(data)
 * @returns true if the passed input is truthy, false otherwise
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
): data is Exclude<T, null | undefined | false | '' | 0> {
  return !!data;
}
