import type { LazyResult } from '../utils/reduce-lazy';
import type { Pred, PredIndexed, PredIndexedOptional } from '../utils/types';

import { purry } from '../function/purry';
import { reduceLazy } from '../utils/reduce-lazy';
import { toLazyIndexed } from '../utils/to-lazy-indexed';

/**
 * Iterate an array using a defined callback function. The original array is returned instead of `void`.
 * @param array The array.
 * @param fn The callback function.
 * @returns The original array
 * @signature
 *    P.forEach(array, fn)
 *    P.forEach.indexed(array, fn)
 * @example
 *    P.forEach([1, 2, 3], x => {
 *      console.log(x)
 *    }) // => [1, 2, 3]
 *    P.forEach.indexed([1, 2, 3], (x, i) => {
 *      console.log(x, i)
 *    }) // => [1, 2, 3]
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
 *    P.forEach(fn)(array)
 *    P.forEach.indexed(fn)(array)
 * @example
 *    P.pipe(
 *      [1, 2, 3],
 *      P.forEach(x => {
 *        console.log(x)
 *      })
 *    ) // => [1, 2, 3]
 *    P.pipe(
 *      [1, 2, 3],
 *      P.forEach.indexed((x, i) => {
 *        console.log(x, i)
 *      })
 *    ) // => [1, 2, 3]
 * @dataLast
 * @indexed
 * @pipeable
 * @category Array
 */
export function forEach<T>(
  fn: Pred<T, void>
): (array: ReadonlyArray<T>) => Array<T>;

export function forEach(...args: any[]) {
  return purry(_forEach(false), args, forEach.lazy);
}

function _forEach(indexed: boolean) {
  return <T, K>(array: Array<T>, fn: PredIndexedOptional<T, K>) => {
    return reduceLazy(
      array,
      indexed ? forEach.lazyIndexed(fn) : forEach.lazy(fn),
      indexed,
    );
  };
}

function _lazy(indexed: boolean) {
  return <T>(fn: PredIndexedOptional<T, void>) => {
    return (
      value: T,
      index?: number,
      array?: ReadonlyArray<T>,
    ): LazyResult<T> => {
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
  };
}

export namespace forEach {
  export function indexed<T>(
    array: ReadonlyArray<T>,
    fn: PredIndexed<T, void>
  ): Array<T>;
  export function indexed<T>(
    fn: PredIndexed<T, void>
  ): (array: ReadonlyArray<T>) => Array<T>;
  export function indexed(...args: any[]) {
    return purry(_forEach(true), args, forEach.lazyIndexed);
  }
  export const lazy = _lazy(false);
  export const lazyIndexed = toLazyIndexed(_lazy(true));
}
