import type { LazyEvaluator } from '../function/pipe';
import type { Pred, PredIndexed, PredIndexedOptional } from '../utils/types';

import { purry } from '../function/purry';
import { toLazyIndexed } from '../utils/to-lazy-indexed';
import { toSingle } from '../utils/to-single';

/**
 * Returns the value of the first element in the array where predicate is true, and undefined otherwise.
 * @param items the array
 * @param fn the predicate
 * @signature
 *    P.find(items, fn)
 *    P.find.indexed(items, fn)
 * @example
 *    P.find([1, 3, 4, 6], n => n % 2 === 0) // => 4
 *    P.find.indexed([1, 3, 4, 6], (n, i) => n % 2 === 0) // => 4
 * @dataFirst
 * @indexed
 * @pipeable
 * @category Array
 */
export function find<T>(
  items: ReadonlyArray<T>,
  fn: Pred<T, boolean>
): T | undefined;

/**
 * Returns the value of the first element in the array where predicate is true, and undefined otherwise.
 * @param fn the predicate
 * @signature
 *    P.find(fn)(items)
 *    P.find.indexed(fn)(items)
 * @example
 *    P.pipe(
 *      [1, 3, 4, 6],
 *      P.find(n => n % 2 === 0)
 *    ) // => 4
 *    P.pipe(
 *      [1, 3, 4, 6],
 *      P.find.indexed((n, i) => n % 2 === 0)
 *    ) // => 4
 * @dataLast
 * @indexed
 * @pipeable
 * @category Array
 */
export function find<T = never>(
  fn: Pred<T, boolean>
): (array: ReadonlyArray<T>) => T | undefined;

export function find(...args: any[]): unknown {
  return purry(find_(false), args, find.lazy);
}

function find_(indexed: boolean) {
  return <T>(array: ReadonlyArray<T>, fn: PredIndexedOptional<T, boolean>) =>
    array.find((item, index, input) =>
      indexed ? fn(item, index, input) : fn(item));
}

function lazy_(indexed: boolean) {
  return <T>(fn: PredIndexedOptional<T, boolean>): LazyEvaluator<T> =>
    (value, index, array) =>
      (indexed ? fn(value, index, array) : fn(value))
        ? { done: true, hasNext: true, next: value }
        : { done: false, hasNext: false };
}

export namespace find {
  export function indexed<T>(
    array: ReadonlyArray<T>,
    fn: PredIndexed<T, boolean>
  ): T | undefined;
  export function indexed<T>(
    fn: PredIndexed<T, boolean>
  ): (array: ReadonlyArray<T>) => T | undefined;
  export function indexed(...args: any[]): unknown {
    return purry(find_(true), args, find.lazyIndexed);
  }

  export const lazy = toSingle(lazy_(false));

  export const lazyIndexed = toSingle(toLazyIndexed(lazy_(true)));
}
