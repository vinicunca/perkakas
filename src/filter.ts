import type { Pred, PredIndexed, PredIndexedOptional } from './_types';
import type { LazyEvaluator } from './pipe';

import { _reduceLazy } from './_reduce-lazy';
import { _toLazyIndexed } from './_to-lazy-indexed';
import { purry } from './purry';

/**
 * Filter the elements of an array that meet the condition specified in a callback function.
 *
 * @param array The array to filter.
 * @param fn the callback function.
 * @signature
 *  filter(array, fn)
 *  filter.indexed(array, fn)
 * @example
 *  import { filter, isIncludedIn } from '@vinicunca/perkakas';
 *
 *  filter([1, 2, 3], x => x % 2 === 1); // => [1, 3]
 *  filter.indexed([1, 2, 3], (x, i, array) => x % 2 === 1); // => [1, 3]
 *  // Excludes the values from `other` array
 *  filter(array, isNot(isIncludedIn(other)))
 *  // Returns a list of elements that exist in both array.
 *  filter(array, isIncludedIn(other))
 * @dataFirst
 * @indexed
 * @pipeable
 * @category Array
 */
export function filter<T, S extends T>(
  array: ReadonlyArray<T>,
  fn: (value: T) => value is S
): Array<S>;
export function filter<T>(
  array: ReadonlyArray<T>,
  fn: Pred<T, boolean>
): Array<T>;

/**
 * Filter the elements of an array that meet the condition specified in a callback function.
 *
 * @param fn the callback function.
 * @signature
 *  filter(fn)(array)
 *  filter.indexed(fn)(array)
 * @example
 *  import { filter, isIncludedIn, isTruthy } from '@vinicunca/perkakas';
 *
 *  pipe([1, 2, 3], filter(x => x % 2 === 1)); // => [1, 3]
 *  pipe([1, 2, 3], filter.indexed((x, i) => x % 2 === 1)); // => [1, 3]
 *  // Filter out all falsy values
 *  filter(isTruthy)
 *  // Counts how many values of the collection pass the specified predicate
 *  filter(fn).length
 *  // Excludes the values from `other` array
 *  filter(isNot(isIncludedIn(other)))
 *  // Returns a list of elements that exist in both array.
 *  filter(isIncludedIn(other))
 * @dataLast
 * @indexed
 * @pipeable
 * @category Array
 */
export function filter<T, S extends T>(
  fn: (input: T) => input is S
): (array: ReadonlyArray<T>) => Array<S>;
export function filter<T>(
  fn: Pred<T, boolean>
): (array: ReadonlyArray<T>) => Array<T>;

export function filter(...args: Array<any>): unknown {
  return purry(filter_(false), args, filter.lazy);
}

function filter_(indexed: boolean) {
  return <T>(array: ReadonlyArray<T>, fn: PredIndexedOptional<T, boolean>) => {
    return _reduceLazy(
      array,
      indexed ? filter.lazyIndexed(fn) : filter.lazy(fn),
      indexed,
    );
  };
}

function lazy_(indexed: boolean) {
  return <T>(fn: PredIndexedOptional<T, boolean>): LazyEvaluator<T> =>
    (value, index, array) =>
      (indexed ? fn(value, index, array) : fn(value))
        ? { done: false, hasNext: true, next: value }
        : { done: false, hasNext: false };
}

export namespace filter {
  export function indexed<T, S extends T>(
    array: ReadonlyArray<T>,
    fn: (input: T, index: number, array: ReadonlyArray<T>) => input is S,
  ): Array<S>;
  export function indexed<T>(
    array: ReadonlyArray<T>,
    fn: PredIndexed<T, boolean>,
  ): Array<T>;
  /**
   * @dataLast
   */
  export function indexed<T, S extends T>(
    fn: (input: T, index: number, array: ReadonlyArray<T>) => input is S,
  ): (array: ReadonlyArray<T>) => Array<S>;
  export function indexed<T>(
    fn: PredIndexed<T, boolean>,
  ): (array: ReadonlyArray<T>) => Array<T>;
  export function indexed(...args: Array<any>): unknown {
    return purry(filter_(true), args, filter.lazyIndexed);
  }

  export const lazy = lazy_(false);
  export const lazyIndexed = _toLazyIndexed(lazy_(true));
}
