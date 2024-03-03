import type { LazyResult } from '../utils/reduce-lazy';

import { purry } from '../function/purry';
import { reduceLazy } from '../utils/reduce-lazy';

/**
 * Returns a list of elements that exist in both array.
 * @param array the source array
 * @param other the second array
 * @signature
 *    P.intersection(array, other)
 * @example
 *    P.intersection([1, 2, 3], [2, 3, 5]) // => [2, 3]
 * @dataFirst
 * @category Array
 * @pipeable
 */
export function intersection<T>(
  array: ReadonlyArray<T>,
  other: ReadonlyArray<T>
): Array<T>;

/**
 * Returns a list of elements that exist in both array.
 * @param other the second array
 * @signature
 *    P.intersection(other)(array)
 * @example
 *    P.intersection([2, 3, 5])([1, 2, 3]) // => [2, 3]
 * @dataLast
 * @category Array
 * @pipeable
 */
export function intersection<T, K>(
  other: ReadonlyArray<T>
): (source: ReadonlyArray<K>) => Array<T>;

export function intersection(...args: any[]) {
  return purry(_intersection, args, intersection.lazy);
}

function _intersection<T>(array: Array<T>, other: Array<T>) {
  const lazy = intersection.lazy(other);
  return reduceLazy(array, lazy);
}

export namespace intersection {
  export function lazy<T>(other: Array<T>) {
    return (value: T): LazyResult<T> => {
      const set = new Set(other);
      if (set.has(value)) {
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
