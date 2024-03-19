import type { Simplify } from 'type-fest';

import { purry } from '../function/purry';

/**
 * Checks if `subObject` is a sub-object of `object`, which means for every
 * property and value in `subObject`, there's the same property in `object`
 * with an equal value. Equality is checked with `isDeepEqual`.
 *
 * @param data - The object to test.
 * @param subObject - The sub-object to test against.
 * @signature
 *    P.hasSubObject(data, subObject)
 * @example
 *    P.hasSubObject({ a: 1, b: 2, c: 3 }, { a: 1, c: 3 }) //=> true
 *    P.hasSubObject({ a: 1, b: 2, c: 3 }, { b: 4 }) //=> false
 *    P.hasSubObject({ a: 1, b: 2, c: 3 }, {}) //=> true
 * @dataFirst
 * @category Guard
 */
export function hasSubObject<T, S extends Partial<T>>(
  data: T,
  subObject: S,
): // TODO: want to use data is Merge<T, S> here, but it's a typescript error. fix after we allow @ts-expect-error in the build process
data is Simplify<S & T>;

/**
 * Checks if `subObject` is a sub-object of `object`, which means for every
 * property and value in `subObject`, there's the same property in `object`
 * with an equal value. Equality is checked with `isDeepEqual`.
 *
 * @param subObject - The sub-object to test against.
 * @signature
 *    P.hasSubObject(subObject)(data)
 * @example
 *    P.hasSubObject({ a: 1, c: 3 })({ a: 1, b: 2, c: 3 }) //=> true
 *    P.hasSubObject({ b: 4 })({ a: 1, b: 2, c: 3 }) //=> false
 *    P.hasSubObject({})({ a: 1, b: 2, c: 3 }) //=> true
 * @dataLast
 * @category Guard
 */
export function hasSubObject<T, S extends Partial<T>>(
  subObject: S,
): (data: T) => data is Simplify<S & T>;

export function hasSubObject(...args: Array<any>): unknown {
  return purry(_hasSubObject, args);
}

function _hasSubObject<T, S extends Partial<T>>(
  data: T,
  subObject: S,
): data is Simplify<S & T> {
  for (const key of Object.keys(subObject)) {
    if (!Object.prototype.hasOwnProperty.call(data, key)) {
      return false;
    }

    // @ts-expect-error [ts7053] - key is in both subObject and data:
    if (!isDeepEqual(subObject[key], data[key])) {
      return false;
    }
  }
  return true;
}
