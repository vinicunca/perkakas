import type { OrderRule } from './internal/curry-order-rules';
import type { CompareFunction } from './internal/types/compare-function';
import type { IterableContainer } from './internal/types/iterable-container';
import type { NonEmptyArray } from './internal/types/non-empty-array';
import {
  curryOrderRulesWithArgument,

} from './internal/curry-order-rules';
import { quickSelect } from './internal/quick-select';

/**
 * Retrieves the element that would be at the given index if the array were sorted according to specified rules. This function uses the *QuickSelect* algorithm running at an average complexity of *O(n)*. Semantically it is equivalent to `sortBy(data, ...rules).at(index)` which would run at *O(nlogn)*.
 *
 * See also `firstBy` which provides an even more efficient algorithm and a stricter return type, but only for `index === 0`. See `takeFirstBy` to get all the elements up to and including `index`.
 *
 * @param data - The input array.
 * @param index - The zero-based index for selecting the element in the sorted order. Negative indices count backwards from the end.
 * @param rules - A variadic array of order rules defining the sorting criteria. Each order rule is a projection function that extracts a comparable value from the data. Sorting is based on these extracted values using the native `<` and `>` operators. Earlier rules take precedence over later ones. Use the syntax `[projection, "desc"]` for descending order.
 * @returns The element at the specified index in the sorted order, or `undefined` if the index is out of bounds.
 * @signature
 *   P.nthBy(data, index, ...rules);
 * @example
 *   P.nthBy([2,1,4,5,3,], 2, identity()); // => 3
 * @dataFirst
 * @category Array
 */
export function nthBy<T extends IterableContainer>(
  data: T,
  index: number,
  ...rules: Readonly<NonEmptyArray<OrderRule<T[number]>>>
): T[number] | undefined;

/**
 * Retrieves the element that would be at the given index if the array were sorted according to specified rules. This function uses the *QuickSelect* algorithm running at an average complexity of *O(n)*. Semantically it is equivalent to `sortBy(data, ...rules)[index]` which would run at *O(nlogn)*.
 *
 * See also `firstBy` which provides an even more efficient algorithm and a stricter return type, but only for `index === 0`. See `takeFirstBy` to get all the elements up to and including `index`.
 *
 * @param index - The zero-based index for selecting the element in the sorted order. Negative indices count backwards from the end.
 * @param rules - A variadic array of order rules defining the sorting criteria. Each order rule is a projection function that extracts a comparable value from the data. Sorting is based on these extracted values using the native `<` and `>` operators. Earlier rules take precedence over later ones. Use the syntax `[projection, "desc"]` for descending order.
 * @returns The element at the specified index in the sorted order, or `undefined` if the index is out of bounds.
 * @signature
 *   P.nthBy(index, ...rules)(data);
 * @example
 *   P.pipe([2,1,4,5,3,], P.nthBy(2, identity())); // => 3
 * @dataLast
 * @category Array
 */
export function nthBy<T extends IterableContainer>(
  index: number,
  ...rules: Readonly<NonEmptyArray<OrderRule<T[number]>>>
): (data: T) => T[number] | undefined;

export function nthBy(...args: ReadonlyArray<unknown>): unknown {
  return curryOrderRulesWithArgument(nthByImplementation, args);
}

function nthByImplementation<T>(
  data: ReadonlyArray<T>,
  compareFn: CompareFunction<T>,
  index: number,
): T | undefined {
  return quickSelect(
    data,
    // Allow negative indices gracefully
    index >= 0 ? index : data.length + index,
    compareFn,
  );
}
