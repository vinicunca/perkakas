import type { CompareFunction, IterableContainer, NonEmptyArray } from './_types';

import { type OrderRule, purryOrderRules } from './_purry-order-rules';

/**
 * Sorts `data` using the provided ordering rules. The `sort` is done via the native `Array.prototype.sort` but is performed on a shallow copy of the array to avoid mutating the original data.
 *
 * To maintain the shape of more complex inputs (like non-empty arrays, tuples, etc...) use the `strict` variant.
 *
 * There are several other functions that take order rules and **bypass** the need to sort the array first (in *O(nlogn)* time):
 * `firstBy` === `first(sortBy(data, ...rules))`, O(n).
 * `takeFirstBy` === `take(sortBy(data, ...rules), k)`, O(nlogk).
 * `dropFirstBy` === `drop(sortBy(data, ...rules), k)`, O(nlogk).
 * `nthBy` === `sortBy(data, ...rules).at(k)`, O(n).
 * `rankBy` === `sortedIndex(sortBy(data, ...rules), item)`, O(n).
 * Refer to the docs for more details.
 *
 * @param rules - A variadic array of order rules defining the sorting criteria. Each order rule is a projection function that extracts a comparable value from the data. Sorting is based on these extracted values using the native `<` and `>` operators. Earlier rules take precedence over later ones. Use the syntax `[projection, "desc"]` for descending order.
 * @return - A shallow copy of the input array sorted by the provided rules.
 * @signature
 *  sortBy(...rules)(data)
 *  sortBy.strict(...rules)(data)
 * @example
 *  import { sortBy, pipe } from '@vinicunca/perkakas';
 *
 *  pipe(
 *    [{ a: 1 }, { a: 3 }, { a: 7 }, { a: 2 }],
 *    sortBy(x => x.a)
 *  ); // => [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 7 }] typed Array<{a:number}>
 *  pipe(
 *    [{ a: 1 }, { a: 3 }] as const,
 *    sortBy.strict(x => x.a)
 *  ); // => [{ a: 1 }, { a: 3 }] typed [{a: 1 | 3}, {a: 1 | 3}]
 * @dataLast
 * @category Array
 * @strict
 */
export function sortBy<T>(
  ...rules: Readonly<NonEmptyArray<OrderRule<T>>>
): (data: ReadonlyArray<T>) => Array<T>;

/**
 * Sorts `data` using the provided ordering rules. The `sort` is done via the native `Array.prototype.sort` but is performed on a shallow copy of the array to avoid mutating the original data.
 *
 * To maintain the shape of more complex inputs (like non-empty arrays, tuples, etc...) use the `strict` variant.
 *
 * There are several other functions that take order rules and **bypass** the need to sort the array first (in *O(nlogn)* time):
 * `firstBy` === `first(sortBy(data, ...rules))`, O(n).
 * `takeFirstBy` === `take(sortBy(data, ...rules), k)`, O(nlogk).
 * `dropFirstBy` === `drop(sortBy(data, ...rules), k)`, O(nlogk).
 * `nthBy` === `sortBy(data, ...rules).at(k)`, O(n).
 * `rankBy` === `sortedIndex(sortBy(data, ...rules), item)`, O(n).
 * Refer to the docs for more details.
 *
 * @param array - The input array.
 * @param sortRules - A variadic array of order rules defining the sorting criteria. Each order rule is a projection function that extracts a comparable value from the data. Sorting is based on these extracted values using the native `<` and `>` operators. Earlier rules take precedence over later ones. Use the syntax `[projection, "desc"]` for descending order.
 * @return - A shallow copy of the input array sorted by the provided rules.
 * @signature
 *  sortBy(data, ...rules)
 *  sortBy.strict(data, ...rules)
 * @example
 *  import { sortBy } from '@vinicunca/perkakas';
 *
 *  sortBy(
 *    [{ a: 1 }, { a: 3 }, { a: 7 }, { a: 2 }],
 *    x => x.a
 *  );
 *  // => [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 7 }] typed Array<{a:number}>
 *
 *  sortBy(
 *   [
 *     {color: 'red', weight: 2},
 *     {color: 'blue', weight: 3},
 *     {color: 'green', weight: 1},
 *     {color: 'purple', weight: 1},
 *   ],
 *    [x => x.weight, 'asc'], x => x.color
 *  );
 *  // =>
 *  //   {color: 'green', weight: 1},
 *  //   {color: 'purple', weight: 1},
 *  //   {color: 'red', weight: 2},
 *  //   {color: 'blue', weight: 3},
 *  // typed Array<{color: string, weight: number}>
 *
 *  sortBy.strict(
 *    [{ a: 1 }, { a: 3 }] as const,
 *    x => x.a
 *  );
 *  // => [{ a: 1 }, { a: 3 }] typed [{a: 1 | 3}, {a: 1 | 3}]
 * @dataFirst
 * @category Array
 * @strict
 */
export function sortBy<T>(
  array: ReadonlyArray<T>,
  ...sortRules: Readonly<NonEmptyArray<OrderRule<T>>>
): Array<T>;

export function sortBy(...args: Array<any>): unknown {
  return purryOrderRules(_sortBy, args);
}

function _sortBy<T>(data: ReadonlyArray<T>,
  compareFn: CompareFunction<T>): Array<T> {
  return data.slice().sort(compareFn);
}

interface Strict {
  <T extends IterableContainer>(
    ...sortRules: Readonly<NonEmptyArray<OrderRule<T[number]>>>
  ): (array: T) => SortedBy<T>;

  <T extends IterableContainer>(
    array: T,
    ...sortRules: Readonly<NonEmptyArray<OrderRule<T[number]>>>
  ): SortedBy<T>;
}

type SortedBy<T extends IterableContainer> = {
  -readonly [P in keyof T]: T[number];
};

export namespace sortBy {
  export const strict: Strict = sortBy;
}
