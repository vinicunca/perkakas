import type { LazyEvaluator } from './internal/types/lazy-evaluator';
import { curry } from './curry';
import { SKIP_ITEM } from './internal/utility-evaluators';

/**
 * Creates a shallow copy of a portion of a given array, filtered down to just
 * the elements from the given array that pass the test implemented by the
 * provided function. Equivalent to `Array.prototype.filter`.
 *
 * @param data - The array to filter.
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to keep the element in the resulting array, and `false`
 * otherwise. A type-predicate can also be used to narrow the result.
 * @returns A shallow copy of the given array containing just the elements that
 * pass the test. If no elements pass the test, an empty array is returned.
 * @signature
 *    P.filter(data, predicate)
 * @example
 *    P.filter([1, 2, 3], x => x % 2 === 1) // => [1, 3]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function filter<T, S extends T>(
  data: ReadonlyArray<T>,
  predicate: (value: T, index: number, data: ReadonlyArray<T>) => value is S,
): Array<S>;
export function filter<T>(
  data: ReadonlyArray<T>,
  predicate: (value: T, index: number, data: ReadonlyArray<T>) => boolean,
): Array<T>;

/**
 * Creates a shallow copy of a portion of a given array, filtered down to just
 * the elements from the given array that pass the test implemented by the
 * provided function. Equivalent to `Array.prototype.filter`.
 *
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to keep the element in the resulting array, and `false`
 * otherwise.
 * @returns A shallow copy of the given array containing just the elements that
 * pass the test. If no elements pass the test, an empty array is returned.
 * @signature
 *    P.filter(predicate)(data)
 * @example
 *    P.pipe([1, 2, 3], P.filter(x => x % 2 === 1)) // => [1, 3]
 * @dataLast
 * @lazy
 * @category Array
 */
export function filter<T, S extends T>(
  predicate: (value: T, index: number, data: ReadonlyArray<T>) => value is S,
): (data: ReadonlyArray<T>) => Array<S>;
export function filter<T>(
  predicate: (value: T, index: number, data: ReadonlyArray<T>) => boolean,
): (data: ReadonlyArray<T>) => Array<T>;

export function filter(...args: ReadonlyArray<unknown>): unknown {
  return curry(filterImplementation, args, lazyImplementation);
}

function filterImplementation<T>(
  data: ReadonlyArray<T>,
  predicate: (value: T, index: number, array: ReadonlyArray<T>) => boolean,
): Array<T> {
  return data.filter(predicate);
};

function lazyImplementation<T>(
  predicate: (value: T, index: number, data: ReadonlyArray<T>) => boolean,
): LazyEvaluator<T> {
  return (value, index, data) =>
    predicate(value, index, data)
      ? { done: false, hasNext: true, next: value }
      : SKIP_ITEM;
}
