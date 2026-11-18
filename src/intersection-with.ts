import type { IsEqualFunction } from './internal/types/is-equal-function';
import type { LazyEvaluator } from './internal/types/lazy-evaluator';
import { curryWithLazy3 } from './internal/curry-with-lazy-by-arity';
import { SKIP_ITEM } from './internal/lazy-control';

/**
 * Returns a list of intersecting values based on a custom
 * comparator function that compares elements of both arrays.
 *
 * @param data - The source data.
 * @param other - The other data.
 * @param isEqual - The custom comparator.
 * @signature
 *    intersectionWith(data, other, isEqual)
 * @example
 *    intersectionWith(
 *      [
 *        { id: 1, name: 'Ryan' },
 *        { id: 3, name: 'Emma' },
 *      ],
 *      [3, 5],
 *      (a, b) => a.id === b,
 *    ) // => [{ id: 3, name: 'Emma' }]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function intersectionWith<T, S>(
  data: ReadonlyArray<T>,
  other: ReadonlyArray<S>,
  isEqual: IsEqualFunction<T, S>,
): Array<T>;

/**
 * Returns a list of intersecting values based on a custom
 * comparator function that compares elements of both arrays.
 *
 * @param other - The other data.
 * @param isEqual - The custom comparator.
 * @signature
 *    intersectionWith(other, isEqual)(data)
 * @example
 *    intersectionWith(
 *      [3, 5],
 *      (a, b) => a.id === b
 *      )([
 *        { id: 1, name: 'Ryan' },
 *        { id: 3, name: 'Emma' },
 *      ]); // => [{ id: 3, name: 'Emma' }]
 * @dataLast
 * @lazy
 * @category Array
 */
export function intersectionWith<T, S>(
  other: ReadonlyArray<S>,
  /**
   * Type inference doesn't work properly for the comparator's first parameter
   * in data last variant.
   */
  isEqual: IsEqualFunction<T, S>,
): (data: ReadonlyArray<T>) => Array<T>;

export function intersectionWith(
  dataOrOther: ReadonlyArray<unknown>,
  otherOrIsEqual?: ReadonlyArray<unknown> | IsEqualFunction,
  isEqual?: IsEqualFunction,
): unknown {
  return curryWithLazy3(
    intersectionWithImplementation,
    lazyImplementation,
    arguments.length,
    dataOrOther,
    otherOrIsEqual,
    isEqual,
  );
}

function intersectionWithImplementation<T, S>(
  data: ReadonlyArray<T>,
  other: ReadonlyArray<S>,
  isEqual: IsEqualFunction<T, S>,
): Array<T> {
  const result: Array<T> = [];
  for (const value of data) {
    if (other.some((otherValue) => isEqual(value, otherValue))) {
      result.push(value);
    }
  }

  return result;
}

const lazyImplementation =
  <T, S>([other, isEqual]: readonly [
    other: ReadonlyArray<S>,
    isEqual: IsEqualFunction<T, S>,
  ]): LazyEvaluator<T> =>
  (value) =>
    other.some((otherValue) => isEqual(value, otherValue)) ? value : SKIP_ITEM;
