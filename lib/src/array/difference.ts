import { type LazyResult, _reduceLazy } from '../utils/reduce-lazy';
import { purry } from '../function';

/**
 * Excludes the values from `other` array.
 * @param array the source array
 * @param other the values to exclude
 * @signature
 *    P.difference(array, other)
 * @example
 *    P.difference([1, 2, 3, 4], [2, 5, 3]) // => [1, 4]
 * @dataFirst
 * @category Array
 * @pipeable
 */
export function difference<T>(
  array: ReadonlyArray<T>,
  other: ReadonlyArray<T>
): Array<T>;

/**
 * Excludes the values from `other` array.
 * @param other the values to exclude
 * @signature
 *    P.difference(other)(array)
 * @example
 *    P.difference([2, 5, 3])([1, 2, 3, 4]) // => [1, 4]
 *    P.pipe(
 *      [1, 2, 3, 4, 5, 6], // only 4 iterations
 *      P.difference([2, 3]),
 *      P.take(2)
 *    ) // => [1, 4]
 * @dataLast
 * @category Array
 * @pipeable
 */
export function difference<T, K>(
  other: ReadonlyArray<T>
): (array: ReadonlyArray<K>) => Array<T>;

export function difference(...args: any[]) {
  return purry(_difference, args, difference.lazy);
}

function _difference<T>(array: Array<T>, other: Array<T>) {
  const lazy = difference.lazy(other);
  return _reduceLazy(array, lazy);
}

export namespace difference {
  export function lazy<T>(other: Array<T>) {
    const set = new Set(other);
    return (value: T): LazyResult<T> => {
      if (!set.has(value)) {
        return {
          done: false,
          hasNext: true,
          next: value,
        };
      }
      return {
        done: false,
        hasNext: false,
      };
    };
  }
}
