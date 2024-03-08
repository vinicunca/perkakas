import type { Pred, PredIndexed, PredIndexedOptional } from '../utils/types';

import { purry } from '../function/purry';

/**
 * Returns the value of the last element in the array where predicate is true, and undefined
 * otherwise.
 * @param array the array
 * @param fn the predicate
 * @signature
 *    P.findLast(items, fn)
 *    P.findLast.indexed(items, fn)
 * @example
 *    P.findLast([1, 3, 4, 6], n => n % 2 === 1) // => 3
 *    P.findLast.indexed([1, 3, 4, 6], (n, i) => n % 2 === 1) // => 3
 * @dataFirst
 * @indexed
 * @pipeable
 * @category Array
 */
export function findLast<T>(
  array: ReadonlyArray<T>,
  fn: Pred<T, boolean>
): T | undefined;

/**
 * Returns the value of the last element in the array where predicate is true, and undefined
 * otherwise.
 * @param fn the predicate
 * @signature
 *    P.findLast(fn)(items)
 *    P.findLast.indexed(fn)(items)
 * @example
 *    P.pipe(
 *      [1, 3, 4, 6],
 *      P.findLast(n => n % 2 === 1)
 *    ) // => 3
 *    P.pipe(
 *      [1, 3, 4, 6],
 *      P.findLast.indexed((n, i) => n % 2 === 1)
 *    ) // => 3
 * @dataLast
 * @indexed
 * @pipeable
 * @category Array
 */
export function findLast<T = never>(
  fn: Pred<T, boolean>
): (array: ReadonlyArray<T>) => T | undefined;

export function findLast(...args: any[]): unknown {
  return purry(findLast_(false), args);
}

function findLast_(indexed: boolean) {
  return <T>(array: ReadonlyArray<T>, fn: PredIndexedOptional<T, boolean>) => {
    for (let i = array.length - 1; i >= 0; i--) {
      if (indexed ? fn(array[i]!, i, array) : fn(array[i]!)) {
        return array[i];
      }
    }

    return undefined;
  };
}

export namespace findLast {
  export function indexed<T>(
    array: ReadonlyArray<T>,
    fn: PredIndexed<T, boolean>
  ): T | undefined;
  export function indexed<T>(
    fn: PredIndexed<T, boolean>
  ): (array: ReadonlyArray<T>) => T | undefined;

  export function indexed(...args: any[]): unknown {
    return purry(findLast_(true), args);
  }
}
