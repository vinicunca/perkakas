import type { Writable } from 'type-fest';
import type { FilteredArray } from './internal/types/filtered-array';
import type { IterableContainer } from './internal/types/iterable-container';
import type { LazyEvaluator } from './internal/types/lazy-evaluator';
import { curry } from './curry';
import { SKIP_ITEM } from './internal/utility-evaluators';

// When the predicate used for filter isn't refining (like a type-predicate) we
// can narrow the result slightly if it's also trivial (it returns the same
// result for all items). This is uncommon, but can be useful to "short-circuit"
// the filter.
type NonRefinedFilteredArray<
  T extends IterableContainer,
  IsItemIncluded extends boolean,
> = boolean extends IsItemIncluded
  // We don't know which items of the array the predicate would allow in the
  // output so we can only safely say that the result is an array with items
  // from the input array.
  // TODO: Theoretically we could build an output shape that would take into account the **order** of elements in the input array by reconstructing it with every single element in it either included or not, but this type can grow to a union of as much as 2^n options which might not be usable in practice.
  ? Array<T[number]>
  : IsItemIncluded extends true
    // If the predicate is always true we return a shallow copy of the array.
    // If it was originally readonly we need to strip that away.
    ? Writable<T>
    // If the predicate is always false we will always return an empty array.
    : [];

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
export function filter<
  T extends IterableContainer,
  Condition extends T[number],
>(
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
export function filter<
  T extends IterableContainer,
  Condition extends T[number],
>(
  predicate: (value: T[number], index: number, data: T) => value is Condition,
): (data: T) => FilteredArray<T, Condition>;
export function filter<
  T extends IterableContainer,
  IsItemIncluded extends boolean,
>(
  predicate: (value: T[number], index: number, data: T) => IsItemIncluded,
): (data: T) => NonRefinedFilteredArray<T, IsItemIncluded>;

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
