import type { CompareFunction, NonEmptyArray } from './_types';

import { type OrderRule, purryOrderRulesWithArgument } from '../utils/purry-order-rules';

/**
 * Calculates the rank of an item in an array based on `rules`. The rank is the position where the item would appear in the sorted array. This function provides an efficient way to determine the rank in *O(n)* time, compared to *O(nlogn)* for the equivalent `sortedIndex(sortBy(data, ...rules), item)`.
 *
 * @param data - The input array.
 * @param item - The item whose rank is to be determined.
 * @param rules - A variadic array of order rules defining the sorting criteria. Each order rule is a projection function that extracts a comparable value from the data. Sorting is based on these extracted values using the native `<` and `>` operators. Earlier rules take precedence over later ones. Use the syntax `[projection, "desc"]` for descending order.
 * @returns - The rank of the item in the sorted array in the range [0..data.length]
 * @signature
 *   rankBy(data, item, ...rules)
 * @example
 *   const DATA = [{ a: 5 }, { a: 1 }, { a: 3 }] as const;
 *   rankBy(DATA, 0, prop('a')) // => 0
 *   rankBy(DATA, 1, prop('a')) // => 1
 *   rankBy(DATA, 2, prop('a')) // => 1
 *   rankBy(DATA, 3, prop('a')) // => 2
 * @dataFirst
 * @category Array
 */
export function rankBy<T>(
  data: ReadonlyArray<T>,
  item: T,
  ...rules: Readonly<NonEmptyArray<OrderRule<T>>>
): number;

/**
 * Calculates the rank of an item in an array based on `rules`. The rank is the position where the item would appear in the sorted array. This function provides an efficient way to determine the rank in *O(n)* time, compared to *O(nlogn)* for the equivalent `sortedIndex(sortBy(data, ...rules), item)`.
 *
 * @param item - The item whose rank is to be determined.
 * @param rules - A variadic array of order rules defining the sorting criteria. Each order rule is a projection function that extracts a comparable value from the data. Sorting is based on these extracted values using the native `<` and `>` operators. Earlier rules take precedence over later ones. Use the syntax `[projection, "desc"]` for descending order.
 * @returns - The rank of the item in the sorted array in the range [0..data.length]
 * @signature
 *   rankBy(item, ...rules)(data)
 * @example
 *   const DATA = [{ a: 5 }, { a: 1 }, { a: 3 }] as const;
 *   pipe(DATA, rankBy(0, prop('a'))) // => 0
 *   pipe(DATA, rankBy(1, prop('a'))) // => 1
 *   pipe(DATA, rankBy(2, prop('a'))) // => 1
 *   pipe(DATA, rankBy(3, prop('a'))) // => 2
 * @dataLast
 * @category Array
 */
export function rankBy<T>(
  item: T,
  ...rules: Readonly<NonEmptyArray<OrderRule<T>>>
): (data: ReadonlyArray<T>) => number;

export function rankBy(...args: Array<any>): unknown {
  return purryOrderRulesWithArgument(rankByImplementation, args);
}

function rankByImplementation<T>(
  data: ReadonlyArray<T>,
  compareFn: CompareFunction<T>,
  targetItem: T,
): number {
  let rank = 0;
  for (const item of data) {
    if (compareFn(targetItem, item) > 0) {
      // The rank of the item is equivalent to the number of items that would
      // come before it if the array was sorted. We assume that the
      rank += 1;
    }
  }
  return rank;
}
