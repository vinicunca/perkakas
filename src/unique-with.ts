import type { DataLastBuilder } from './internal/types/data-last-builder';
import type { Deduped } from './internal/types/deduped';
import type { IsEqualFunction } from './internal/types/is-equal-function';
import type { IterableContainer } from './internal/types/iterable-container';
import type { LazyEvaluator } from './internal/types/lazy-evaluator';
import { SKIP_ITEM } from './internal/lazy-control';
import { withLazyImplementation } from './internal/lazy-data-last-implementation';
import { requireData } from './internal/require-data';

/**
 * Returns a new array containing only one copy of each element in the original
 * list. Elements are compared by custom comparator isEquals.
 *
 * @param data - The array to filter.
 * @param isEquals - The comparator.
 * @signature
 *    uniqueWith(data, isEquals)
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
  isEquals: IsEqualFunction<T[number]>,
): Deduped<T>;

/**
 * Returns a new array containing only one copy of each element in the original
 * list. Elements are compared by custom comparator isEquals.
 *
 * @param isEquals - The comparator.
 * @signature uniqueWith(isEquals)(data)
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
  isEquals: IsEqualFunction<T[number]>,
): (data: T) => Deduped<T>;

export function uniqueWith(
  dataOrIsEquals: IterableContainer | IsEqualFunction,
  isEquals?: IsEqualFunction,
): unknown {
  return typeof dataOrIsEquals === 'function'
    ? withLazyImplementation(
        // eslint-disable-next-line ts/no-use-before-define -- implementations follow the overloaded signatures
        dataLast(dataOrIsEquals),
        lazyImplementation,
        dataOrIsEquals,
      )
    : uniqueWithImplementation(
        dataOrIsEquals,
        // @ts-expect-error [ts2345] -- `typeof` narrows only the first parameter; the data-first overloads guarantee the rest.
        isEquals,
      );
}

const dataLast: DataLastBuilder<typeof uniqueWithImplementation> =
  (isEquals) => (data) =>
    uniqueWithImplementation(data, isEquals);

const uniqueWithImplementation = <T>(
  data: ReadonlyArray<T>,
  isEquals: IsEqualFunction<T>,
): T[] =>
  data.filter(
    (value, index) =>
      data.findIndex(
        (otherValue, otherIndex) =>
          index === otherIndex || isEquals(value, otherValue),
      ) === index,
  );

const lazyImplementation = <T>(
  isEquals: IsEqualFunction<T>,
): LazyEvaluator<T> =>
  requireData((value, index, data) =>
    data.findIndex(
      (otherValue, otherIndex) =>
        index === otherIndex || isEquals(value, otherValue),
    ) === index
      ? value
      : SKIP_ITEM);
