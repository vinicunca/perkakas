/**
 * A function that checks if the passed parameter is a Date and narrows its type accordingly
 * @param data the variable to check
 * @signature
 *    P.isDate(data)
 * @returns true if the passed input is a Date, false otherwise
 * @example
 *    P.isDate(new Date()) //=> true
 *    P.isDate('somethingElse') //=> false
 * @category Guard
 */
export function isDate(data: unknown): data is Date {
  return data instanceof Date;
}
