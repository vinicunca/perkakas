import type { Pred, PredIndexed, PredIndexedOptional } from '../utils/types';

import { purry } from '../function/purry';
import { type LazyResult, reduceLazy } from '../utils/reduce-lazy';
import { toLazyIndexed } from '../utils/to-lazy-indexed';

/**
 * Filter the elements of an array that meet the condition specified in a callback function.
 * @param array The array to filter.
 * @param fn the callback function.
 * @signature
 *    P.filter(array, fn)
 *    P.filter.indexed(array, fn)
 * @example
 *    P.filter([1, 2, 3], x => x % 2 === 1) // => [1, 3]
 *    P.filter.indexed([1, 2, 3], (x, i, array) => x % 2 === 1) // => [1, 3]
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
 * @param fn the callback function.
 * @signature
 *    P.filter(fn)(array)
 *    P.filter.indexed(fn)(array)
 * @example
 *    P.pipe([1, 2, 3], P.filter(x => x % 2 === 1)) // => [1, 3]
 *    P.pipe([1, 2, 3], P.filter.indexed((x, i) => x % 2 === 1)) // => [1, 3]
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

export function filter(...args: any[]) {
  return purry(filter_(false), args, filter.lazy);
}

function filter_(indexed: boolean) {
  return <T>(array: ReadonlyArray<T>, fn: PredIndexedOptional<T, boolean>) => {
    return reduceLazy(
      array,
      indexed ? filter.lazyIndexed(fn) : filter.lazy(fn),
      indexed,
    );
  };
}

function lazy_(indexed: boolean) {
  return <T>(fn: PredIndexedOptional<T, boolean>) => {
    return (value: T, index?: number, array?: ReadonlyArray<T>): LazyResult<T> => {
      const valid = indexed ? fn(value, index, array) : fn(value);
      if (valid) {
        return {
          done: false,
          hasNext: true,
          next: value,
        };
      }
      return {
        done: false,
        hasNext: false,
      };
    };
  };
}

export namespace filter {
  export function indexed<T, S extends T>(
    array: ReadonlyArray<T>,
    fn: (input: T, index: number, array: Array<T>) => input is S
  ): Array<S>;
  export function indexed<T>(
    array: ReadonlyArray<T>,
    fn: PredIndexed<T, boolean>
  ): Array<T>;
  /**
   * @dataLast
   */
  export function indexed<T, S extends T>(
    fn: (input: T, index: number, array: Array<T>) => input is S
  ): (array: ReadonlyArray<T>) => Array<S>;
  export function indexed<T>(
    fn: PredIndexed<T, boolean>
  ): (array: ReadonlyArray<T>) => Array<T>;
  export function indexed(...args: any[]) {
    return purry(filter_(true), args, filter.lazyIndexed);
  }

  export const lazy = lazy_(false);
  export const lazyIndexed = toLazyIndexed(lazy_(true));
}
