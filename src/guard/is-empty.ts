import { isArray } from './is-array';
import { isObject } from './is-object';
import { isString } from './is-string';

/**
 * A function that checks if the passed parameter is empty
 * @param data the variable to check
 * @signature
 *    P.isEmpty(data)
 * @returns true if the passed input is empty, false otherwise
 * @example
 *    P.isEmpty('') //=> true
 *    P.isEmpty([]) //=> true
 *    P.isEmpty({}) //=> true
 *    P.isEmpty('test') //=> false
 *    P.isEmpty([1, 2, 3]) //=> false
 *    P.isEmpty({ length: 0 }) //=> false
 * @category Function
 */
export function isEmpty(data: string): data is '';
export function isEmpty(data: ReadonlyArray<unknown> | []): data is [];
export function isEmpty<T extends Readonly<Record<PropertyKey, unknown>>>(
  data: T
): data is Record<keyof T, never>;
export function isEmpty(data: unknown): boolean {
  if (isArray(data) || isString(data)) {
    return data.length === 0;
  }

  if (isObject(data)) {
    // eslint-disable-next-line no-unreachable-loop,no-restricted-syntax
    for (const _ in data) {
      return false;
    }

    return !(data instanceof RegExp);
  }

  return false;
}
