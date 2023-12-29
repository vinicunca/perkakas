import type { Pred, PredIndexed, PredIndexedOptional } from '../utils/types';

import { purry } from '../function';
import { toLazyIndexed } from '../utils/to-lazy-indexed';
import { toSingle } from '../utils/to-single';

/**
 * Returns the index of the first element in the array where predicate is true, and -1 otherwise.
 * @param items the array
 * @param fn the predicate
 * @signature
 *    P.findIndex(items, fn)
 *    P.findIndex.indexed(items, fn)
 * @example
 *    P.findIndex([1, 3, 4, 6], n => n % 2 === 0) // => 2
 *    P.findIndex.indexed([1, 3, 4, 6], (n, i) => n % 2 === 0) // => 2
 * @dataFirst
 * @indexed
 * @pipeable
 * @category Array
 */
export function findIndex<T>(
  items: ReadonlyArray<T>,
  fn: Pred<T, boolean>
): number;

/**
 * Returns the index of the first element in the array where predicate is true, and -1 otherwise.
 * @param fn the predicate
 * @signature
 *    P.findIndex(fn)(items)
 *    P.findIndex.indexed(fn)(items)
 * @example
 *    P.pipe(
 *      [1, 3, 4, 6],
 *      P.findIndex(n => n % 2 === 0)
 *    ) // => 2
 *    P.pipe(
 *      [1, 3, 4, 6],
 *      P.findIndex.indexed((n, i) => n % 2 === 0)
 *    ) // => 2
 * @dataLast
 * @indexed
 * @pipeable
 * @category Array
 */
export function findIndex<T>(
  fn: Pred<T, boolean>
): (items: ReadonlyArray<T>) => number;

export function findIndex(...args: any[]) {
  return purry(_findIndex(false), args, findIndex.lazy);
}

function _findIndex(indexed: boolean) {
  return <T>(array: Array<T>, fn: PredIndexedOptional<T, boolean>) => {
    if (indexed) {
      return array.findIndex(fn);
    }

    return array.findIndex((x) => fn(x));
  };
}

function _lazy(indexed: boolean) {
  return <T>(fn: PredIndexedOptional<T, boolean>) => {
    let i = 0;
    return (value: T, index?: number, array?: Array<T>) => {
      const valid = indexed ? fn(value, index, array) : fn(value);
      if (valid) {
        return {
          done: true,
          hasNext: true,
          next: i,
        };
      }
      i++;
      return {
        done: false,
        hasNext: false,
      };
    };
  };
}

export namespace findIndex {
  export function indexed<T>(
    array: ReadonlyArray<T>,
    fn: PredIndexed<T, boolean>
  ): number;
  export function indexed<T>(
    fn: PredIndexed<T, boolean>
  ): (array: ReadonlyArray<T>) => number;
  export function indexed(...args: any[]) {
    return purry(_findIndex(true), args, findIndex.lazyIndexed);
  }

  export const lazy = toSingle(_lazy(false));

  export const lazyIndexed = toSingle(toLazyIndexed(_lazy(true)));
}
