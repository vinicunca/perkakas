import type { PredIndexed, PredIndexedOptional } from '../utils/types';

import { purry } from '../function';

function _meanBy(indexed: boolean) {
  return <T>(array: Array<T>, fn: PredIndexedOptional<T, number>) => {
    if (array.length === 0) {
      return Number.NaN;
    }

    let sum = 0;
    array.forEach((item, i) => {
      sum += indexed ? fn(item, i, array) : fn(item);
    });

    return sum / array.length;
  };
}

/**
 * Returns the mean of the elements of an array using the provided predicate.
 * @param fn predicate function
 * @signature
 *   P.meanBy(fn)(array)
 *   P.meanBy.indexed(fn)(array)
 * @example
 *    P.pipe(
 *      [{a: 5}, {a: 1}, {a: 3}],
 *      P.meanBy(x => x.a)
 *    ) // 3
 * @dataLast
 * @indexed
 * @category Array
 */

export function meanBy<T>(
  fn: (item: T) => number
): (items: ReadonlyArray<T>) => number;

/**
 * Returns the mean of the elements of an array using the provided predicate.
 * @param items the array
 * @param fn predicate function
 * @signature
 *   P.meanBy(array, fn)
 *   P.meanBy.indexed(array, fn)
 * @example
 *    P.meanBy(
 *      [{a: 5}, {a: 1}, {a: 3}],
 *      x => x.a
 *    ) // 3
 * @dataFirst
 * @indexed
 * @category Array
 */

export function meanBy<T>(
  items: ReadonlyArray<T>,
  fn: (item: T) => number
): number;

export function meanBy(...args: any[]) {
  return purry(_meanBy(false), args);
}

export namespace meanBy {
  export function indexed<T>(
    array: ReadonlyArray<T>,
    fn: PredIndexed<T, number>
  ): number;

  export function indexed<T>(
    fn: PredIndexed<T, number>
  ): (array: ReadonlyArray<T>) => number;

  export function indexed(...args: any[]) {
    return purry(_meanBy(true), args);
  }
}
