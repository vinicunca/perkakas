import type { IterableContainer } from '../utils/types';

import { isArray } from './is-array';
import { isObject } from './is-object';
import { isString } from './is-string';

/**
 * A function that checks if the passed parameter is empty.
 *
 * `undefined` is also considered empty, but only when it's in a union with a
 * `string` or string-like type.
 *
 * This guard doesn't work negated because of typescript limitations! If you
 * need to check that an array is *not* empty, use `P.hasAtLeast(data, 1)`
 * and not `!P.isEmpty(data)`. For strings and objects there's no way in
 * typescript to narrow the result to a non-empty type.
 *
 * @param data the variable to check
 * @signature
 *    P.isEmpty(data)
 * @returns true if the passed input is empty, false otherwise
 * @example
 *    P.isEmpty(undefined) //=>true
 *    P.isEmpty('') //=> true
 *    P.isEmpty([]) //=> true
 *    P.isEmpty({}) //=> true
 *    P.isEmpty('test') //=> false
 *    P.isEmpty([1, 2, 3]) //=> false
 *    P.isEmpty({ length: 0 }) //=> false
 * @category Guard
 */
export function isEmpty<T extends string | undefined>(
  data: T,
): data is
  | ('' extends T ? '' : never)
  | (undefined extends T ? undefined : never);
export function isEmpty(data: IterableContainer): data is [];
export function isEmpty<T extends Readonly<Record<PropertyKey, unknown>>>(
  data: T,
): data is Record<keyof T, never>;
export function isEmpty(data: unknown): boolean {
  if (data === undefined) {
    return true;
  }

  if (isArray(data) || isString(data)) {
    return data.length === 0;
  }

  if (isObject(data)) {
    return Object.keys(data).length === 0;
  }

  return false;
}
