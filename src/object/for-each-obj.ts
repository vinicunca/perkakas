import { purry } from '../function/purry';

type IndexedIteratee<
  T extends Record<PropertyKey, unknown>,
  K extends keyof T,
> = (value: T[K], key: K, obj: T) => void;
type UnindexedIteratee<T extends Record<PropertyKey, unknown>> = (
  value: T[keyof T],
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
export function forEachObj<T extends Record<PropertyKey, unknown>>(
  object: T,
  fn: UnindexedIteratee<T>,
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
export function forEachObj<T extends Record<PropertyKey, unknown>>(
  fn: UnindexedIteratee<T>,
): (object: T) => T;

export function forEachObj(...args: any[]): unknown {
  return purry(forEachObj_(false), args);
}

function forEachObj_(indexed: boolean) {
  return <T extends Record<PropertyKey, unknown>>(
    data: T,
    fn: (
      value: T[Extract<keyof T, string>],
      key?: Extract<keyof T, string>,
      obj?: T,
    ) => void,
  ) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const { [key]: val } = data;
        if (indexed) {
          fn(val, key, data);
        } else {
          fn(val);
        }
      }
    }
    return data;
  };
}

export namespace forEachObj {
  export function indexed<T extends Record<PropertyKey, unknown>>(
    object: T,
    fn: IndexedIteratee<T, keyof T>,
  ): T;
  export function indexed<T extends Record<PropertyKey, unknown>>(
    fn: IndexedIteratee<T, keyof T>,
  ): (object: T) => T;
  export function indexed(...args: any[]): unknown {
    return purry(forEachObj_(true), args);
  }
}
