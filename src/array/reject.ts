import { type LazyResult } from '../utils/reduce-lazy';
import { purry } from '../function/purry';
import { _reduceLazy } from '../utils/reduce-lazy';
import { type Pred, type PredIndexed, type PredIndexedOptional } from '../utils/types';
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
 * @data_first
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
 * @param items The array to reject.
 * @param fn the callback function.
 * @signature
 *    P.reject(array, fn)
 *    P.reject.indexed(array, fn)
 * @example
 *    P.reject([1, 2, 3], x => x % 2 === 0) // => [1, 3]
 *    P.reject.indexed([1, 2, 3], (x, i, array) => x % 2 === 0) // => [1, 3]
 * @data_first
 * @indexed
 * @pipeable
 * @category Array
 */
export function reject<T>(
  fn: Pred<T, boolean>
): (items: ReadonlyArray<T>) => Array<T>;

export function reject() {
  return purry(_reject(false), arguments, reject.lazy);
}

function _reject(indexed: boolean) {
  return <T>(array: Array<T>, fn: PredIndexedOptional<T, boolean>) => {
    return _reduceLazy(
      array,
      indexed ? reject.lazyIndexed(fn) : reject.lazy(fn),
      indexed,
    );
  };
}

function _lazy(indexed: boolean) {
  return <T>(fn: PredIndexedOptional<T, boolean>) => {
    return (value: T, index?: number, array?: Array<T>): LazyResult<T> => {
      const valid = indexed ? fn(value, index, array) : fn(value);
      if (!valid) {
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

export namespace reject {
  export function indexed<T, K>(
    array: ReadonlyArray<T>,
    fn: PredIndexed<T, boolean>
  ): Array<K>;
  export function indexed<T, K>(
    fn: PredIndexed<T, boolean>
  ): (array: ReadonlyArray<T>) => Array<K>;
  export function indexed() {
    return purry(_reject(true), arguments, reject.lazyIndexed);
  }

  export const lazy = _lazy(false);
  export const lazyIndexed = toLazyIndexed(_lazy(true));
}
