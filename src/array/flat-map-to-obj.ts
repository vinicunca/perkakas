import type { PredIndexedOptional } from '../utils/types';

import { purry } from '../function/purry';

/**
 * Map each element of an array into an object using a defined callback function and flatten the result.
 * @param array The array to map.
 * @param fn The mapping function, which should return an Array of key-value pairs, similar to Object.fromEntries
 * @returns The new mapped object.
 * @signature
 *    P.flatMapToObj(array, fn)
 *    P.flatMapToObj.indexed(array, fn)
 * @example
 *  P.flatMapToObj([1, 2, 3], (x) =>
 *    x % 2 === 1 ? [[String(x), x]] : []
 *  ) // => {1: 1, 3: 3}
 *  P.flatMapToObj.indexed(['a', 'b'], (x, i) => [
 *    [x, i],
 *    [x + x, i + i],
 *  ]) // => {a: 0, aa: 0, b: 1, bb: 2}
 * @dataFirst
 * @indexed
 * @category Array
 */
export function flatMapToObj<T, K extends PropertyKey, V>(
  array: ReadonlyArray<T>,
  fn: (element: T) => Array<[K, V]>
): Record<K, V>;

/**
 * Map each element of an array into an object using a defined callback function and flatten the result.
 * @param fn The mapping function, which should return an Array of key-value pairs, similar to Object.fromEntries
 * @returns The new mapped object.
 * @signature
 *    P.flatMapToObj(fn)(array)
 *    P.flatMapToObj(fn)(array)
 * @example
 *    P.pipe(
 *      [1, 2, 3],
 *      P.flatMapToObj(x => (x % 2 === 1 ? [[String(x), x]] : []))
 *    ) // => {1: 1, 3: 3}
 *    P.pipe(
 *      ['a', 'b'],
 *      P.flatMapToObj.indexed((x, i) => [
 *        [x, i],
 *        [x + x, i + i],
 *      ])
 *    ) // => {a: 0, aa: 0, b: 1, bb: 2}
 * @dataLast
 * @indexed
 * @category Array
 */
export function flatMapToObj<T, K extends PropertyKey, V>(
  fn: (element: T) => Array<[K, V]>
): (array: ReadonlyArray<T>) => Record<K, V>;

export function flatMapToObj(...args: Array<any>): unknown {
  return purry(flatMapToObj_(false), args);
}

function flatMapToObj_(indexed: boolean) {
  return <T>(
    array: ReadonlyArray<T>,
    fn: PredIndexedOptional<
      T,
      ReadonlyArray<readonly [key: PropertyKey, value: unknown]>
    >,
  ) => {
    const out: Record<PropertyKey, unknown> = {};
    for (const [index, element] of array.entries()) {
      const items = indexed ? fn(element, index, array) : fn(element);

      for (const [key, value] of items) {
        out[key] = value;
      }
    }

    return out;
  };
}

export namespace flatMapToObj {
  export function indexed<T, K extends PropertyKey, V>(
    array: ReadonlyArray<T>,
    fn: (element: T, index: number, array: ReadonlyArray<T>) => Array<[K, V]>
  ): Record<K, V>;
  export function indexed<T, K extends PropertyKey, V>(
    fn: (element: T, index: number, array: ReadonlyArray<T>) => Array<[K, V]>
  ): (array: ReadonlyArray<T>) => Record<K, V>;
  export function indexed(...args: Array<any>): unknown {
    return purry(flatMapToObj_(true), args);
  }
}
