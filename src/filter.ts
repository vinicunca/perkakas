import type { FilteredArray } from './internal/types/filtered-array';
import type { IterableContainer } from './internal/types/iterable-container';
import type {
  LazyCallback,
  LazyTypePredicate,
} from './internal/types/lazy-callback';
import type { LazyEvaluator } from './internal/types/lazy-evaluator';
import type { NonRefinedFilteredArray } from './internal/types/non-refined-filtered-array';
import { curry } from './curry';
import { SKIP_ITEM } from './internal/utility-evaluators';

/**
 * Creates a shallow copy of a portion of a given array, filtered down to just
 * the elements from the given array that pass the test implemented by the
 * provided function. Equivalent to `Array.prototype.filter`.
 *
 * Related operations:
 * - `splice` - to shape the array by *position* rather than by *value*.
 *
 * @param data - The array to filter.
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to keep the element in the resulting array, and `false`
 * otherwise. A type-predicate can also be used to narrow the result.
 * @returns A shallow copy of the given array containing just the elements that
 * pass the test. If no elements pass the test, an empty array is returned.
 * @signature
 *    filter(data, predicate)
 * @example
 *    filter([1, 2, 3], x => x % 2 === 1) // => [1, 3]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function filter<T extends IterableContainer, Condition>(
  data: T,
  predicate: (value: T[number], index: number, data: T) => value is Condition,
): FilteredArray<T, Condition>;

export function filter<
  T extends IterableContainer,
  IsItemIncluded extends boolean,
>(
  data: T,
  predicate: (value: T[number], index: number, data: T) => IsItemIncluded,
): NonRefinedFilteredArray<T, IsItemIncluded>;

/**
 * Creates a shallow copy of a portion of a given array, filtered down to just
 * the elements from the given array that pass the test implemented by the
 * provided function. Equivalent to `Array.prototype.filter`.
 *
 * Related operations:
 * - `splice` - to shape the array by *position* rather than by *value*.
 *
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to keep the element in the resulting array, and `false`
 * otherwise. A type-predicate can also be used to narrow the result.
 * @returns A shallow copy of the given array containing just the elements that
 * pass the test. If no elements pass the test, an empty array is returned.
 * @signature
 *    filter(predicate)(data)
 * @example
 *    pipe([1, 2, 3], filter(x => x % 2 === 1)) // => [1, 3]
 * @dataLast
 * @lazy
 * @category Array
 */
export function filter<T extends IterableContainer, Condition>(
  predicate: LazyTypePredicate<T, Condition>,
): (data: T) => FilteredArray<T, Condition>;

export function filter<
  T extends IterableContainer,
  IsItemIncluded extends boolean,
>(
  predicate: LazyCallback<T, IsItemIncluded>,
): (data: T) => NonRefinedFilteredArray<T, IsItemIncluded>;

export function filter(...args: ReadonlyArray<unknown>): unknown {
  return curry(filterImplementation, args, lazyImplementation);
}

function filterImplementation<T>(data: ReadonlyArray<T>, predicate: (value: T, index: number, array: ReadonlyArray<T>) => boolean): Array<T> {
  return data.filter(predicate);
}

function lazyImplementation<T>(predicate: (value: T, index: number, data: ReadonlyArray<T>) => boolean): LazyEvaluator<T> {
  return (value, index, data) =>
    predicate(value, index, data)
      ? { done: false, hasNext: true, next: value }
      : SKIP_ITEM;
}
