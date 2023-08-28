import { type Pred, type PredIndexed, type PredIndexedOptional } from '../utils/types';
import { purry } from '../function';

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
 * @data_first
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
 * @data_last
 * @indexed
 * @pipeable
 * @category Array
 */
export function findLast<T = never>(
  fn: Pred<T, boolean>
): (array: ReadonlyArray<T>) => T | undefined;

export function findLast() {
  return purry(_findLast(false), arguments);
}

function _findLast(indexed: boolean) {
  return <T>(array: Array<T>, fn: PredIndexedOptional<T, boolean>) => {
    for (let i = array.length - 1; i >= 0; i--) {
      if (indexed ? fn(array[i], i, array) : fn(array[i])) {
        return array[i];
      }
    }
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

  export function indexed() {
    return purry(_findLast(true), arguments);
  }
}
