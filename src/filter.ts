import type { LazyEvaluator } from './internal/lazy-evaluator';
import type { ArrayCallback, ArrayTypePredicate, LazyCallback, LazyTypePredicate } from './internal/types/callback';
import type { DataLastBuilder } from './internal/types/data-last-builder';
import type { FilteredArray } from './internal/types/filtered-array';
import type { IterableContainer } from './internal/types/iterable-container';
import type { NonRefinedFilteredArray } from './internal/types/non-refined-filtered-array';
import { SKIP_ITEM } from './internal/lazy-control';
import { withLazyImplementation } from './internal/lazy-data-last-implementation';
import { requireDataByArity } from './internal/require-data';

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
  predicate: ArrayTypePredicate<T, Condition>,
): FilteredArray<T, Condition>;

export function filter<
  T extends IterableContainer,
  IsItemIncluded extends boolean,
>(
  data: T,
  predicate: ArrayCallback<T, IsItemIncluded>,
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

export function filter(
  dataOrPredicate: IterableContainer | LazyCallback<IterableContainer, boolean>,
  predicate?: ArrayCallback<IterableContainer, boolean>,
): unknown {
  return typeof dataOrPredicate === 'function'
    ? withLazyImplementation(
        // eslint-disable-next-line ts/no-use-before-define -- implementations follow the overloaded signatures
        dataLast(
          // @ts-expect-error [ts2345] -- Run eagerly, the data-last function hands the callback the complete input, a valid non-empty prefix whenever the callback is invoked (it never is for an empty input); TypeScript can't relate `T` to `NonEmptyPrefix<T>`.
          dataOrPredicate,
        ),
        lazyImplementation,
        // @ts-expect-error [ts2345] -- `lazyImplementation` invokes the callback only once the input has an item, so the prefix it passes is never empty; TypeScript can't tell from its `readonly T[]` type.
        dataOrPredicate,
      )
    : filterImplementation(
        dataOrPredicate,
        // @ts-expect-error [ts2345] -- `typeof` narrows only the first parameter; the data-first overloads guarantee the rest.
        predicate,
      );
}

const dataLast: DataLastBuilder<typeof filterImplementation>
  = (predicate) => (data) =>
    filterImplementation(data, predicate);

function filterImplementation<T>(data: ReadonlyArray<T>, predicate: (value: T, index: number, data: ReadonlyArray<T>) => boolean): Array<T> {
  return data.filter(predicate);
}

function lazyImplementation<T>(predicate: (value: T, index: number, data: ReadonlyArray<T>) => boolean): LazyEvaluator<T> {
  return requireDataByArity(predicate, 2, (value, index, data) =>
    predicate(value, index, data)
      ? value
      : SKIP_ITEM);
}
