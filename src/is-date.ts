/**
 * A function that checks if the passed parameter is a Date and narrows its type accordingly
 * @param data the variable to check
 * @signature
 *    isDate(data)
 * @returns true if the passed input is a Date, false otherwise
 * @example
 *    isDate(new Date()) //=> true
 *    isDate('somethingElse') //=> false
 * @category Guard
 */
export function isDate(data: unknown): data is Date {
  return data instanceof Date;
}
