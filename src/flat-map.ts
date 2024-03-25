import type { LazyEvaluator } from '../pipe';

import { purry } from '../purry';
import { flatten } from './flatten';

/**
 * Map each element of an array using a defined callback function and flatten the mapped result.
 *
 * @param array The array to map.
 * @param fn The function mapper.
 * @signature
 *    flatMap(array, fn)
 * @example
 *    flatMap([1, 2, 3], x => [x, x * 10]) // => [1, 10, 2, 20, 3, 30]
 * @dataFirst
 * @pipeable
 * @category Array
 */
export function flatMap<T, K>(
  array: ReadonlyArray<T>,
  fn: (input: T) => K | ReadonlyArray<K>
): Array<K>;

/**
 * Map each element of an array using a defined callback function and flatten the mapped result.
 *
 * @param fn The function mapper.
 * @signature
 *    flatMap(fn)(array)
 * @example
 *    pipe([1, 2, 3], flatMap(x => [x, x * 10])) // => [1, 10, 2, 20, 3, 30]
 * @dataLast
 * @pipeable
 * @category Array
 */
export function flatMap<T, K>(
  fn: (input: T) => K | ReadonlyArray<K>
): (array: ReadonlyArray<T>) => Array<K>;

export function flatMap(...args: Array<any>): unknown {
  return purry(flatMap_, args, flatMap.lazy);
}

function flatMap_<T, K>(
  array: ReadonlyArray<T>,
  fn: (input: T) => ReadonlyArray<K>,
): Array<K> {
  return flatten(array.map((item) => fn(item)));
}

export namespace flatMap {
  export function lazy<T, K>(fn: (input: T) => K | ReadonlyArray<K>): LazyEvaluator<T, K> {
    // @ts-expect-error [ts2322] - We need to make LazyMany better so it accommodate the typing here...
    return (value) => {
      const next = fn(value);
      return Array.isArray(next)
        ? { done: false, hasMany: true, hasNext: true, next }
        : { done: false, hasNext: true, next };
    };
  }
}
