import type { LazyEvaluator } from '../function/pipe';

import { purry } from '../function/purry';
import { reduceLazy } from '../utils/reduce-lazy';

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

export function difference(...args: any[]): unknown {
  return purry(difference_, args, difference.lazy);
}

function difference_<T>(
  array: ReadonlyArray<T>,
  other: ReadonlyArray<T>,
): Array<T> {
  const lazy = difference.lazy(other);
  return reduceLazy(array, lazy);
}

export namespace difference {
  export function lazy<T>(other: ReadonlyArray<T>): LazyEvaluator<T> {
    const set = new Set(other);
    return (value) =>
      set.has(value)
        ? { done: false, hasNext: false }
        : { done: false, hasNext: true, next: value };
  }
}
