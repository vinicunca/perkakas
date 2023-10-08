import { type PredIndexedOptional } from '../utils/types';
import { purry } from '../function';

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
export function flatMapToObj<T, K extends keyof any, V>(
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
export function flatMapToObj<T, K extends keyof any, V>(
  fn: (element: T) => Array<[K, V]>
): (array: ReadonlyArray<T>) => Record<K, V>;

export function flatMapToObj() {
  return purry(_flatMapToObj(false), arguments);
}

function _flatMapToObj(indexed: boolean) {
  return (array: Array<any>, fn: PredIndexedOptional<any, any>) => {
    return array.reduce((result, element, index) => {
      const items = indexed ? fn(element, index, array) : fn(element);
      items.forEach(([key, value]: [any, any]) => {
        result[key] = value;
      });
      return result;
    }, {});
  };
}

export namespace flatMapToObj {
  export function indexed<T, K extends keyof any, V>(
    array: ReadonlyArray<T>,
    fn: (element: T, index: number, array: ReadonlyArray<T>) => Array<[K, V]>
  ): Record<K, V>;
  export function indexed<T, K extends keyof any, V>(
    fn: (element: T, index: number, array: ReadonlyArray<T>) => Array<[K, V]>
  ): (array: ReadonlyArray<T>) => Record<K, V>;
  export function indexed() {
    return purry(_flatMapToObj(true), arguments);
  }
}
