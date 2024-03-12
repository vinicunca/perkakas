import type { PredIndexedOptional } from '../utils/types';

import { purry } from '../function/purry';

/**
 * Map each element of an array into an object using a defined callback function.
 * @param array The array to map.
 * @param fn The mapping function, which should return a tuple of [key, value], similar to Object.fromEntries
 * @returns The new mapped object.
 * @signature
 *    P.mapToObj(array, fn)
 *    P.mapToObj.indexed(array, fn)
 * @example
 *    P.mapToObj([1, 2, 3], x => [String(x), x * 2]) // => {1: 2, 2: 4, 3: 6}
 *    P.mapToObj.indexed([0, 0, 0], (x, i) => [i, i]) // => {0: 0, 1: 1, 2: 2}
 * @dataFirst
 * @indexed
 * @category Array
 */
export function mapToObj<T, K extends PropertyKey, V>(
  array: ReadonlyArray<T>,
  fn: (element: T) => [K, V]
): Record<K, V>;

/**
 * Map each element of an array into an object using a defined callback function.
 * @param fn The mapping function, which should return a tuple of [key, value], similar to Object.fromEntries
 * @returns The new mapped object.
 * @signature
 *    P.mapToObj(fn)(array)
 *    P.mapToObj.indexed(fn)(array)
 * @example
 *    P.pipe(
 *      [1, 2, 3],
 *      P.mapToObj(x => [String(x), x * 2])
 *    ) // => {1: 2, 2: 4, 3: 6}
 *    P.pipe(
 *      [0, 0, 0],
 *      P.mapToObj.indexed((x, i) => [i, i])
 *    ) // => {0: 0, 1: 1, 2: 2}
 * @dataLast
 * @indexed
 * @category Array
 */
export function mapToObj<T, K extends PropertyKey, V>(
  fn: (element: T) => [K, V]
): (array: ReadonlyArray<T>) => Record<K, V>;

export function mapToObj(...args: any[]): unknown {
  return purry(mapToObj_(false), args);
}

function mapToObj_(indexed: boolean) {
  return (
    array: ReadonlyArray<unknown>,
    fn: PredIndexedOptional<unknown, [PropertyKey, unknown]>,
  ) => {
    const out: Record<PropertyKey, unknown> = {};

    for (const [index, element] of array.entries()) {
      const [key, value] = indexed ? fn(element, index, array) : fn(element);
      out[key] = value;
    }

    return out;
  };
}

export namespace mapToObj {
  export function indexed<T, K extends PropertyKey, V>(
    array: ReadonlyArray<T>,
    fn: (element: T, index: number, array: ReadonlyArray<T>) => [K, V]
  ): Record<K, V>;

  export function indexed<T, K extends PropertyKey, V>(
    fn: (element: T, index: number, array: ReadonlyArray<T>) => [K, V]
  ): (array: ReadonlyArray<T>) => Record<K, V>;
  export function indexed(...args: any[]): unknown {
    return purry(mapToObj_(true), args);
  }
}