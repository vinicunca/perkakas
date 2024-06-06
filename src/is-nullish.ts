/**
 * A function that checks if the passed parameter is either `null` or
 * `undefined` and narrows its type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is either `null` or `undefined`, false
 * otherwise.
 * @signature
 *    P.isNullish(data)
 * @example
 *    P.isNullish(undefined) //=> true
 *    P.isNullish(null) //=> true
 *    P.isNullish('somethingElse') //=> false
 * @category Guard
 */
export function isNullish<T>(data: T): data is Extract<T, null | undefined> {
  return data === null || data === undefined;
}
