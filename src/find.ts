import type { Pred, PredIndexed, PredIndexedOptional } from './_types';
import type { LazyEvaluator } from './pipe';

import { _toLazyIndexed } from './_to-lazy-indexed';
import { _toSingle } from './_to-single';
import { purry } from './purry';

/**
 * Returns the value of the first element in the array where predicate is true, and undefined otherwise.
 * @param items the array
 * @param fn the predicate
 * @signature
 *  find(items, fn)
 *  find.indexed(items, fn)
 * @example
 *  import { find } from '@vinicunca/perkakas';
 *
 *  find([1, 3, 4, 6], n => n % 2 === 0) // => 4
 *  find.indexed([1, 3, 4, 6], (n, i) => n % 2 === 0) // => 4
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
 *  find(fn)(items)
 *  find.indexed(fn)(items)
 * @example
 *  import { find, pipe } from '@vinicunca/perkakas';
 *
 *  pipe(
 *    [1, 3, 4, 6],
 *    find(n => n % 2 === 0)
 *  ) // => 4
 *  pipe(
 *    [1, 3, 4, 6],
 *    find.indexed((n, i) => n % 2 === 0)
 *  ) // => 4
 * @dataLast
 * @indexed
 * @pipeable
 * @category Array
 */
export function find<T = never>(
  fn: Pred<T, boolean>
): (array: ReadonlyArray<T>) => T | undefined;

export function find(...args: Array<any>): unknown {
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
  export function indexed(...args: Array<any>): unknown {
    return purry(find_(true), args, find.lazyIndexed);
  }

  export const lazy = _toSingle(lazy_(false));

  export const lazyIndexed = _toSingle(_toLazyIndexed(lazy_(true)));
}
