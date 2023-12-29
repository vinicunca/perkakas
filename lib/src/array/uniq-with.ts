import type { LazyResult } from '../utils/reduce-lazy';

import { purry } from '../function';
import { _reduceLazy } from '../utils/reduce-lazy';
import { toLazyIndexed } from '../utils/to-lazy-indexed';

type IsEquals<T> = (a: T, b: T) => boolean;

/**
 * Returns a new array containing only one copy of each element in the original list.
 * Elements are compared by custom comparator isEquals.
 * @param array
 * @param isEquals the comparator
 * @signature
 *    P.uniqWith(array, isEquals)
 * @example
 *    P.uniqWith(
 *      [{a: 1}, {a: 2}, {a: 2}, {a: 5}, {a: 1}, {a: 6}, {a: 7}],
 *      P.equals,
 *    ) // => [{a: 1}, {a: 2}, {a: 5}, {a: 6}, {a: 7}]
 * @dataFirst
 * @category Array
 */
export function uniqWith<T>(
  array: ReadonlyArray<T>,
  isEquals: IsEquals<T>
): Array<T>;

/**
 * Returns a new array containing only one copy of each element in the original list.
 * Elements are compared by custom comparator isEquals.
 * @param isEquals the comparator
 * @signature P.uniqWith(isEquals)(array)
 * @example
 *    P.uniqWith(P.equals)(
 *      [{a: 1}, {a: 2}, {a: 2}, {a: 5}, {a: 1}, {a: 6}, {a: 7}],
 *    ) // => [{a: 1}, {a: 2}, {a: 5}, {a: 6}, {a: 7}]
 *    P.pipe(
 *      [{a: 1}, {a: 2}, {a: 2}, {a: 5}, {a: 1}, {a: 6}, {a: 7}], // only 4 iterations
 *      P.uniqWith(P.equals),
 *      P.take(3)
 *    ) // => [{a: 1}, {a: 2}, {a: 5}]
 * @dataLast
 * @category Object
 */
export function uniqWith<T>(
  isEquals: IsEquals<T>
): (array: ReadonlyArray<T>) => Array<T>;

export function uniqWith(...args: any[]) {
  return purry(_uniqWith, args, uniqWith.lazy);
}

function _uniqWith<T>(array: Array<T>, isEquals: IsEquals<T>) {
  const lazy = uniqWith.lazy(isEquals);
  return _reduceLazy(array, lazy, true);
}

function _lazy<T>(isEquals: IsEquals<T>) {
  return (value: T, index?: number, array?: Array<T>): LazyResult<T> => {
    if (
      array
      && array.findIndex((otherValue) => isEquals(value, otherValue)) === index
    ) {
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

export namespace uniqWith {
  export const lazy = toLazyIndexed(_lazy);
}
