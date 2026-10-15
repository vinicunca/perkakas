import type { Deduped } from './internal/types/deduped';
import type { IterableContainer } from './internal/types/iterable-container';
import type { LazyEvaluator } from './internal/types/lazy-evaluator';
import { curryWithLazy } from './internal/curry-with-lazy';
import { SKIP_ITEM } from './internal/lazy-control';
import { requireData } from './internal/require-data';

type IsEquals<T> = (a: T, b: T) => boolean;

/**
 * Returns a new array containing only one copy of each element in the original
 * list. Elements are compared by custom comparator isEquals.
 *
 * @param data - The array to filter.
 * @param isEquals - The comparator.
 * @signature
 *    uniqueWith(array, isEquals)
 * @example
 *    uniqueWith(
 *      [{a: 1}, {a: 2}, {a: 2}, {a: 5}, {a: 1}, {a: 6}, {a: 7}],
 *      equals,
 *    ) // => [{a: 1}, {a: 2}, {a: 5}, {a: 6}, {a: 7}]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function uniqueWith<T extends IterableContainer>(
  data: T,
  isEquals: IsEquals<T[number]>,
): Deduped<T>;

/**
 * Returns a new array containing only one copy of each element in the original
 * list. Elements are compared by custom comparator isEquals.
 *
 * @param isEquals - The comparator.
 * @signature uniqueWith(isEquals)(array)
 * @example
 *    uniqueWith(equals)(
 *      [{a: 1}, {a: 2}, {a: 2}, {a: 5}, {a: 1}, {a: 6}, {a: 7}],
 *    ) // => [{a: 1}, {a: 2}, {a: 5}, {a: 6}, {a: 7}]
 *    pipe(
 *      [{a: 1}, {a: 2}, {a: 2}, {a: 5}, {a: 1}, {a: 6}, {a: 7}], // only 4 iterations
 *      uniqueWith(equals),
 *      take(3)
 *    ) // => [{a: 1}, {a: 2}, {a: 5}]
 * @dataLast
 * @lazy
 * @category Array
 */
export function uniqueWith<T extends IterableContainer>(
  isEquals: IsEquals<T[number]>,
): (data: T) => Deduped<T>;

export function uniqueWith(...args: ReadonlyArray<unknown>): unknown {
  return curryWithLazy(uniqueWithImplementation, args, lazyImplementation);
}

function uniqueWithImplementation<T>(
  data: ReadonlyArray<T>,
  isEquals: IsEquals<T>,
): Array<T> {
  const result: Array<T> = [];
  for (const [index, value] of data.entries()) {
    if (
      data.findIndex(
        (otherValue, otherIndex) =>
          index === otherIndex || isEquals(value, otherValue),
      ) === index
    ) {
      result.push(value);
    }
  }

  return result;
}

function lazyImplementation<T>(isEquals: IsEquals<T>): LazyEvaluator<T> {
  return requireData((value, index, data) =>
    data.findIndex(
      (otherValue, otherIndex) =>
        index === otherIndex || isEquals(value, otherValue),
    ) === index
      ? value
      : SKIP_ITEM);
}
