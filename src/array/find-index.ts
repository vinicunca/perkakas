import type { LazyEvaluator } from '../function/pipe';
import type { Pred, PredIndexed, PredIndexedOptional } from '../utils/types';

import { purry } from '../function/purry';
import { toLazyIndexed } from '../utils/to-lazy-indexed';
import { toSingle } from '../utils/to-single';

/**
 * Returns the index of the first element in the array where predicate is true, and -1 otherwise.
 *
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
 *
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

export function findIndex(...args: Array<any>): unknown {
  return purry(findIndex_(false), args, findIndex.lazy);
}

function findIndex_(indexed: boolean) {
  return <T>(array: ReadonlyArray<T>, fn: PredIndexedOptional<T, boolean>) =>
    array.findIndex((item, index, input) =>
      indexed ? fn(item, index, input) : fn(item));
}

function lazy_(indexed: boolean) {
  return <T>(fn: PredIndexedOptional<T, boolean>): LazyEvaluator<T, number> => {
    // TODO: We use the `actualIndex` here because we can't trust the index coming from pipe. This is due to the fact that the `indexed` abstraction might turn off incrementing the index or not send it at all. Once we simplify the code base by removing the non-indexed versions, we can remove this.
    let actualIndex = 0;
    return (value, index, array) => {
      if (indexed ? fn(value, index, array) : fn(value)) {
        return { done: true, hasNext: true, next: actualIndex };
      }
      actualIndex += 1;
      return { done: false, hasNext: false };
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
  export function indexed(...args: Array<any>): unknown {
    return purry(findIndex_(true), args, findIndex.lazyIndexed);
  }

  export const lazy = toSingle(lazy_(false));

  export const lazyIndexed = toSingle(toLazyIndexed(lazy_(true)));
}
