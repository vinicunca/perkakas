/**
 * A function that checks if the passed parameter is Nil (null or undefined) and narrows its type accordingly
 * @param data the variable to check
 * @signature
 *    isNil(data)
 * @returns true if the passed input is Nil (null or undefined), false otherwise
 * @example
 *    isNil(undefined) //=> true
 *    isNil(null) //=> true
 *    isNil('somethingElse') //=> false
 * @category Guard
 */
export function isNil<T>(data: T): data is Extract<T, null | undefined> {
  return data === null || data === undefined;
}
