import type { Pred, PredIndexed, PredIndexedOptional } from '../utils/types';

import { purry } from '../function/purry';

/**
 * Returns the index of the last element in the array where predicate is true, and -1 otherwise.
 *
 * @param array the array
 * @param fn the predicate
 * @signature
 *    P.findLastIndex(items, fn)
 *    P.findLastIndex.indexed(items, fn)
 * @example
 *    P.findLastIndex([1, 3, 4, 6], n => n % 2 === 1) // => 1
 *    P.findLastIndex.indexed([1, 3, 4, 6], (n, i) => n % 2 === 1) // => 1
 * @dataFirst
 * @indexed
 * @pipeable
 * @category Array
 */
export function findLastIndex<T>(
  array: ReadonlyArray<T>,
  fn: Pred<T, boolean>
): number;

/**
 * Returns the index of the last element in the array where predicate is true, and -1 otherwise.
 *
 * @param fn the predicate
 * @signature
 *    P.findLastIndex(fn)(items)
 *    P.findLastIndex.indexed(fn)(items)
 * @example
 *    P.pipe(
 *      [1, 3, 4, 6],
 *      P.findLastIndex(n => n % 2 === 1)
 *    ) // => 1
 *    P.pipe(
 *      [1, 3, 4, 6],
 *      P.findLastIndex.indexed((n, i) => n % 2 === 1)
 *    ) // => 1
 * @dataLast
 * @indexed
 * @pipeable
 * @category Array
 */
export function findLastIndex<T>(
  fn: Pred<T, boolean>
): (array: ReadonlyArray<T>) => number;

export function findLastIndex(...args: Array<any>): unknown {
  return purry(findLastIndex_(false), args);
}

function findLastIndex_(indexed: boolean) {
  return <T>(array: ReadonlyArray<T>, fn: PredIndexedOptional<T, boolean>) => {
    for (let i = array.length - 1; i >= 0; i--) {
      if (indexed ? fn(array[i]!, i, array) : fn(array[i]!)) {
        return i;
      }
    }

    return -1;
  };
}

export namespace findLastIndex {
  export function indexed<T>(
    array: ReadonlyArray<T>,
    fn: PredIndexed<T, boolean>
  ): number;
  export function indexed<T>(
    fn: PredIndexed<T, boolean>
  ): (array: ReadonlyArray<T>) => number;

  export function indexed(...args: Array<any>): unknown {
    return purry(findLastIndex_(true), args);
  }
}
