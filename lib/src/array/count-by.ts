import type { Pred, PredIndexed, PredIndexedOptional } from '../utils/types';

import { purry } from '../function';

function _countBy(indexed: boolean) {
  return <T>(array: Array<T>, fn: PredIndexedOptional<T, boolean>) => {
    return array.reduce((ret, item, index) => {
      const value = indexed ? fn(item, index, array) : fn(item);
      return ret + (value ? 1 : 0);
    }, 0);
  };
}

/**
 * Counts how many values of the collection pass the specified predicate.
 * @param items The input data.
 * @param fn The predicate.
 * @signature
 *    P.countBy(array, fn)
 * @example
 *    P.countBy([1, 2, 3, 4, 5], x => x % 2 === 0) // => 2
 * @dataFirst
 * @indexed
 * @category Array
 */
export function countBy<T>(
  items: ReadonlyArray<T>,
  fn: Pred<T, boolean>
): number;

export function countBy<T>(
  fn: Pred<T, boolean>
): (array: ReadonlyArray<T>) => number;

/**
 * Counts how many values of the collection pass the specified predicate.
 * @param args The predicate.
 * @signature
 *    P.countBy(args)(array)
 * @example
 *    P.pipe([1, 2, 3, 4, 5], P.countBy(x => x % 2 === 0)) // => 2
 * @dataLast
 * @indexed
 * @category Array
 */
export function countBy(...args: any[]) {
  return purry(_countBy(false), args);
}

export namespace countBy {
  export function indexed<T>(
    array: ReadonlyArray<T>,
    fn: PredIndexed<T, boolean>
  ): number;
  export function indexed<T>(
    fn: PredIndexed<T, boolean>
  ): (array: ReadonlyArray<T>) => number;
  export function indexed(...args: any[]) {
    return purry(_countBy(true), args);
  }
}
