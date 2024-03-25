import type { LazyEvaluator } from './pipe';

import { _reduceLazy } from './_reduce-lazy';
import { _toLazyIndexed } from './_to-lazy-indexed';
import { purry } from './purry';

type IsEquals<T> = (a: T, b: T) => boolean;

/**
 * Returns a new array containing only one copy of each element in the original
 * list. Elements are compared by custom comparator isEquals.
 *
 * @param array - The array to filter.
 * @param isEquals - The comparator.
 * @signature
 *  uniqueWith(array, isEquals)
 * @example
 *  import { uniqueWith, isDeepEqual } from '@vinicunca/perkakas';
 *
 *  uniqueWith(
 *    [{a: 1}, {a: 2}, {a: 2}, {a: 5}, {a: 1}, {a: 6}, {a: 7}],
 *    isDeepEqual,
 *  ) // => [{a: 1}, {a: 2}, {a: 5}, {a: 6}, {a: 7}]
 * @dataFirst
 * @category Array
 */
export function uniqueWith<T>(
  array: ReadonlyArray<T>,
  isEquals: IsEquals<T>,
): Array<T>;

/**
 * Returns a new array containing only one copy of each element in the original
 * list. Elements are compared by custom comparator isEquals.
 *
 * @param isEquals - The comparator.
 * @signature uniqueWith(isEquals)(array)
 * @example
 *  import { uniqueWith, isDeepEqual, pipe, take } from '@vinicunca/perkakas';
 *
 *  uniqueWith(isDeepEqual)(
 *    [{a: 1}, {a: 2}, {a: 2}, {a: 5}, {a: 1}, {a: 6}, {a: 7}],
 *  ) // => [{a: 1}, {a: 2}, {a: 5}, {a: 6}, {a: 7}]
 *  pipe(
 *    [{a: 1}, {a: 2}, {a: 2}, {a: 5}, {a: 1}, {a: 6}, {a: 7}], // only 4 iterations
 *    uniqueWith(isDeepEqual),
 *    take(3)
 *  ) // => [{a: 1}, {a: 2}, {a: 5}]
 * @dataLast
 * @category Object
 */
export function uniqueWith<T>(
  isEquals: IsEquals<T>,
): (array: ReadonlyArray<T>) => Array<T>;

export function uniqueWith(...args: Array<any>): unknown {
  return purry(uniqueWithImplementation, args, uniqueWith.lazy);
}

function uniqueWithImplementation<T>(
  array: ReadonlyArray<T>,
  isEquals: IsEquals<T>,
): Array<T> {
  const lazy = uniqueWith.lazy(isEquals);
  return _reduceLazy(array, lazy, true);
}

function lazy_<T>(isEquals: IsEquals<T>): LazyEvaluator<T> {
  return (value, index, array) =>
    array !== undefined
    && array.findIndex((otherValue) => isEquals(value, otherValue)) === index
      ? { done: false, hasNext: true, next: value }
      : { done: false, hasNext: false };
}

export namespace uniqueWith {
  export const lazy = _toLazyIndexed(lazy_);
}
