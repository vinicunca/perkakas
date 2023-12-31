import { purry } from '../function';

type IndexedIteratee<T extends Record<PropertyKey, any>, K extends keyof T> = (
  value: T[K],
  key: K,
  obj: T
) => void;
type UnindexedIteratee<T extends Record<PropertyKey, any>> = (
  value: T[keyof T]
) => void;

/**
 * Iterate an object using a defined callback function. The original object is returned.
 * @param object The object.
 * @param fn The callback function.
 * @returns The original object
 * @signature
 *    P.forEachObj(object, fn)
 * @example
 *    P.forEachObj({a: 1}, (val) => {
 *      console.log(`${val}`)
 *    }) // "1"
 *    P.forEachObj.indexed({a: 1}, (val, key, obj) => {
 *      console.log(`${key}: ${val}`)
 *    }) // "a: 1"
 * @dataFirst
 * @category Object
 */
export function forEachObj<T extends Record<PropertyKey, any>>(
  object: T,
  fn: UnindexedIteratee<T>
): T;

/**
 * Iterate an object using a defined callback function. The original object is returned.
 * @param fn The callback function.
 * @signature
 *    P.forEachObj(fn)(object)
 * @example
 *  P.pipe(
 *      {a: 1},
 *      P.forEachObj((val) => console.log(`${val}`))
 *    ) // "1"
 *    P.pipe(
 *      {a: 1},
 *      P.forEachObj.indexed((val, key) => console.log(`${key}: ${val}`))
 *    ) // "a: 1"
 * @dataLast
 * @category Object
 */
export function forEachObj<T extends Record<PropertyKey, any>>(
  fn: UnindexedIteratee<T>
): (object: T) => T;

export function forEachObj(...args: any[]) {
  return purry(_forEachObj(false), args);
}

function _forEachObj(indexed: boolean) {
  return (object: any, fn: (value: any, key?: any, obj?: any) => void) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        const val = object[key];
        if (indexed) {
          fn(val, key, object);
        } else {
          fn(val);
        }
      }
    }
    return object;
  };
}

export namespace forEachObj {
  export function indexed<T extends Record<PropertyKey, any>>(
    object: T,
    fn: IndexedIteratee<T, keyof T>
  ): T;
  export function indexed<T extends Record<PropertyKey, any>>(
    fn: IndexedIteratee<T, keyof T>
  ): (object: T) => T;
  export function indexed(...args: any[]) {
    return purry(_forEachObj(true), args);
  }
}
