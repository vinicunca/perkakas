import type { Pred, PredIndexed, PredIndexedOptional } from './_types';
import type { LazyEvaluator } from './pipe';

import { _reduceLazy } from './_reduce-lazy';
import { _toLazyIndexed } from './_to-lazy-indexed';
import { purry } from './purry';

/**
 * Iterate an array using a defined callback function. The original array is returned instead of `void`.
 * @param array The array.
 * @param fn The callback function.
 * @returns The original array
 * @signature
 *  forEach(array, fn)
 *  forEach.indexed(array, fn)
 * @example
 *  import { forEach } from '@vinicunca/perkakas';
 *
 *  forEach([1, 2, 3], x => {
 *    console.log(x)
 *  }) // => [1, 2, 3]
 *  forEach.indexed([1, 2, 3], (x, i) => {
 *    console.log(x, i)
 *  }) // => [1, 2, 3]
 * @dataFirst
 * @indexed
 * @pipeable
 * @category Array
 */
export function forEach<T>(
  array: ReadonlyArray<T>,
  fn: Pred<T, void>
): Array<T>;

/**
 * Iterate an array using a defined callback function. The original array is returned instead of `void`.
 * @param fn the function mapper
 * @signature
 *  forEach(fn)(array)
 *  forEach.indexed(fn)(array)
 * @example
 *  import { forEach, pipe } from '@vinicunca/perkakas';
 *
 *  pipe(
 *    [1, 2, 3],
 *    forEach(x => {
 *      console.log(x)
 *    })
 *  ) // => [1, 2, 3]
 *  pipe(
 *    [1, 2, 3],
 *    forEach.indexed((x, i) => {
 *      console.log(x, i)
 *    })
 *  ) // => [1, 2, 3]
 * @dataLast
 * @indexed
 * @pipeable
 * @category Array
 */
export function forEach<T>(
  fn: Pred<T, void>
): (array: ReadonlyArray<T>) => Array<T>;

export function forEach(...args: Array<any>): unknown {
  return purry(forEach_(false), args, forEach.lazy);
}

function forEach_(indexed: boolean) {
  return <T, K>(array: ReadonlyArray<T>, fn: PredIndexedOptional<T, K>) =>
    _reduceLazy(
      array,
      indexed ? forEach.lazyIndexed(fn) : forEach.lazy(fn),
      indexed,
    );
}

function lazy_(indexed: boolean) {
  return <T>(fn: PredIndexedOptional<T, void>): LazyEvaluator<T> =>
    (value, index, array) => {
      if (indexed) {
        fn(value, index, array);
      } else {
        fn(value);
      }
      return {
        done: false,
        hasNext: true,
        next: value,
      };
    };
}

export namespace forEach {
  export function indexed<T>(
    array: ReadonlyArray<T>,
    fn: PredIndexed<T, void>,
  ): Array<T>;
  export function indexed<T>(
    fn: PredIndexed<T, void>,
  ): (array: ReadonlyArray<T>) => Array<T>;
  export function indexed(...args: Array<any>): unknown {
    return purry(forEach_(true), args, forEach.lazyIndexed);
  }
  export const lazy = lazy_(false);
  export const lazyIndexed = _toLazyIndexed(lazy_(true));
}
