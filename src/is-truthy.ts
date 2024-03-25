/**
 * A function that checks if the passed parameter is truthy and narrows its type accordingly
 *
 * @param data the variable to check
 * @signature
 *  isTruthy(data)
 * @returns true if the passed input is truthy, false otherwise
 * @example
 *  import { isTruthy } from '@vinicunca/perkakas';
 *
 *  isTruthy('somethingElse'); // => true
 *  isTruthy(null); // => false
 *  isTruthy(undefined); // => false
 *  isTruthy(false); // => false
 *  isTruthy(0); // => false
 *  isTruthy(''); // => false
 * @category Guard
 */
export function isTruthy<T>(
  data: T,
): data is Exclude<T, '' | 0 | false | null | undefined> {
  return !!data;
}
