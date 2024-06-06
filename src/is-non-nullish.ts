/**
 * A function that checks if the passed parameter is defined *AND* isn't `null`
 * and narrows its type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is defined and isn't `null`, false
 * otherwise.
 * @signature
 *    P.isNonNullish(data)
 * @example
 *    P.isNonNullish('string') //=> true
 *    P.isNonNullish(null) //=> false
 *    P.isNonNullish(undefined) //=> false
 * @category Guard
 */
export function isNonNullish<T>(data: T): data is NonNullable<T> {
  return data !== undefined && data !== null;
}
