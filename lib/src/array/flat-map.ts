import { purry } from '../function';
import { flatten } from './flatten';

/**
 * Map each element of an array using a defined callback function and flatten the mapped result.
 * @param array The array to map.
 * @param fn The function mapper.
 * @signature
 *    P.flatMap(array, fn)
 * @example
 *    P.flatMap([1, 2, 3], x => [x, x * 10]) // => [1, 10, 2, 20, 3, 30]
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
 * @param fn The function mapper.
 * @signature
 *    P.flatMap(fn)(array)
 * @example
 *    P.pipe([1, 2, 3], P.flatMap(x => [x, x * 10])) // => [1, 10, 2, 20, 3, 30]
 * @dataLast
 * @pipeable
 * @category Array
 */
export function flatMap<T, K>(
  fn: (input: T) => K | ReadonlyArray<K>
): (array: ReadonlyArray<T>) => Array<K>;

export function flatMap(...args: any[]) {
  return purry(_flatMap, args, flatMap.lazy);
}

function _flatMap<T, K>(
  array: Array<T>,
  fn: (input: T) => ReadonlyArray<K>,
): Array<K> {
  return flatten(array.map((item) => fn(item)));
}

export namespace flatMap {
  export function lazy<T, K>(fn: (input: T) => K | ReadonlyArray<K>) {
    return (value: T) => {
      const next = fn(value);
      if (Array.isArray(next)) {
        return {
          done: false,
          hasMany: true,
          hasNext: true,
          next,
        };
      }
      return {
        done: false,
        hasNext: true,
        next,
      };
    };
  }
}
