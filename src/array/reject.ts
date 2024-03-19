import type { LazyEvaluator } from '../function/pipe';
import type { Pred, PredIndexed, PredIndexedOptional } from '../utils/types';

import { purry } from '../function/purry';
import { reduceLazy } from '../utils/reduce-lazy';
import { toLazyIndexed } from '../utils/to-lazy-indexed';

/**
 * Reject the elements of an array that meet the condition specified in a callback function.
 * @param items The array to reject.
 * @param fn the callback function.
 * @signature
 *    P.reject(array, fn)
 *    P.reject.indexed(array, fn)
 * @example
 *    P.reject([1, 2, 3], x => x % 2 === 0) // => [1, 3]
 *    P.reject.indexed([1, 2, 3], (x, i, array) => x % 2 === 0) // => [1, 3]
 * @dataFirst
 * @indexed
 * @pipeable
 * @category Array
 */
export function reject<T>(
  items: ReadonlyArray<T>,
  fn: Pred<T, boolean>
): Array<T>;

/**
 * Reject the elements of an array that meet the condition specified in a callback function.
 * @param fn the callback function.
 * @signature
 *    P.reject(array, fn)
 *    P.reject.indexed(array, fn)
 * @example
 *    P.reject([1, 2, 3], x => x % 2 === 0) // => [1, 3]
 *    P.reject.indexed([1, 2, 3], (x, i, array) => x % 2 === 0) // => [1, 3]
 * @dataFirst
 * @indexed
 * @pipeable
 * @category Array
 */
export function reject<T>(
  fn: Pred<T, boolean>
): (items: ReadonlyArray<T>) => Array<T>;

export function reject(...args: Array<any>): unknown {
  return purry(reject_(false), args, reject.lazy);
}

function reject_(indexed: boolean) {
  return <T>(array: ReadonlyArray<T>, fn: PredIndexedOptional<T, boolean>) => {
    return reduceLazy(
      array,
      indexed ? reject.lazyIndexed(fn) : reject.lazy(fn),
      indexed,
    );
  };
}

function lazy_(indexed: boolean) {
  return <T>(fn: PredIndexedOptional<T, boolean>): LazyEvaluator<T> =>
    (item, index, data) =>
      (indexed ? fn(item, index, data) : fn(item))
        ? { done: false, hasNext: false }
        : { done: false, hasNext: true, next: item };
}

export namespace reject {
  export function indexed<T, K>(
    array: ReadonlyArray<T>,
    fn: PredIndexed<T, boolean>
  ): Array<K>;
  export function indexed<T, K>(
    fn: PredIndexed<T, boolean>
  ): (array: ReadonlyArray<T>) => Array<K>;
  export function indexed(...args: Array<any>): unknown {
    return purry(reject_(true), args, reject.lazyIndexed);
  }

  export const lazy = lazy_(false);
  export const lazyIndexed = toLazyIndexed(lazy_(true));
}
