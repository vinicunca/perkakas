import type { Deduped } from './internal/types/deduped';
import type { IterableContainer } from './internal/types/iterable-container';
import type { LazyEvaluator } from './internal/types/lazy-evaluator';
import { curryFromLazy } from './internal/curry-from-lazy';
import { SKIP_ITEM } from './internal/utility-evaluators';

type IsEquals<T> = (a: T, b: T) => boolean;

/**
 * Returns a new array containing only one copy of each element in the original
 * list. Elements are compared by custom comparator isEquals.
 *
 * @param data - The array to filter.
 * @param isEquals - The comparator.
 * @signature
 *    P.uniqueWith(array, isEquals)
 * @example
 *    P.uniqueWith(
 *      [{a: 1}, {a: 2}, {a: 2}, {a: 5}, {a: 1}, {a: 6}, {a: 7}],
 *      P.equals,
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
 * @signature P.uniqueWith(isEquals)(array)
 * @example
 *    P.uniqueWith(P.equals)(
 *      [{a: 1}, {a: 2}, {a: 2}, {a: 5}, {a: 1}, {a: 6}, {a: 7}],
 *    ) // => [{a: 1}, {a: 2}, {a: 5}, {a: 6}, {a: 7}]
 *    P.pipe(
 *      [{a: 1}, {a: 2}, {a: 2}, {a: 5}, {a: 1}, {a: 6}, {a: 7}], // only 4 iterations
 *      P.uniqueWith(P.equals),
 *      P.take(3)
 *    ) // => [{a: 1}, {a: 2}, {a: 5}]
 * @dataLast
 * @lazy
 * @category Array
 */
export function uniqueWith<T extends IterableContainer>(
  isEquals: IsEquals<T[number]>,
): (data: T) => Deduped<T>;

export function uniqueWith(...args: ReadonlyArray<unknown>): unknown {
  return curryFromLazy(lazyImplementation, args);
}

function lazyImplementation<T>(isEquals: IsEquals<T>): LazyEvaluator<T> {
  return (value, index, data) => {
    const firstEqualIndex = data.findIndex(
      (otherValue, otherIndex) =>
        index === otherIndex || isEquals(value, otherValue),
    );

    // skip items that aren't at the first equal index.
    return firstEqualIndex === index
      ? { done: false, hasNext: true, next: value }
      : SKIP_ITEM;
  };
}
