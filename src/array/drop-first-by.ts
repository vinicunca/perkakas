import type { CompareFunction, NonEmptyArray } from '../utils/types';

import { heapMaybeInsert, heapify } from '../utils/heap';
import { type OrderRule, purryOrderRulesWithArgument } from '../utils/purry-order-rules';

/**
 * Drop the first `n` items from `data` based on the provided ordering criteria.
 * This allows you to avoid sorting the array before dropping the items.
 * The complexity of this function is *O(Nlogn)* where `N` is the length of the array.
 *
 * For the opposite operation (to keep `n` elements) see `takeFirstBy`.
 *
 * @params data - the input array
 * @params n - the number of items to drop. If `n` is non-positive no items would be dropped and a *clone* of the input would be returned, if `n` is bigger then data.length no items would be returned.
 * @param rules - A variadic array of order rules defining the sorting criteria. Each order rule is a projection function that extracts a comparable value from the data. Sorting is based on these extracted values using the native `<` and `>` operators. Earlier rules take precedence over later ones. Use the syntax `[projection, "desc"]` for descending order.
 * @returns a subset of the input array.
 * @signature
 *   P.dropFirstBy(data, n, ...rules);
 * @example
 *   P.dropFirstBy(['aa', 'aaaa', 'a', 'aaa'], 2, x => x.length); // => ['aaa', 'aaaa']
 * @dataFirst
 * @category Array
 */
export function dropFirstBy<T>(
  data: ReadonlyArray<T>,
  n: number,
  ...rules: Readonly<NonEmptyArray<OrderRule<T>>>
): Array<T>;

/**
 * Drop the first `n` items from `data` based on the provided ordering criteria. This allows you to avoid sorting the array before dropping the items. The complexity of this function is *O(Nlogn)* where `N` is the length of the array.
 *
 * For the opposite operation (to keep `n` elements) see `takeFirstBy`.
 *
 * @params n - the number of items to drop. If `n` is non-positive no items would be dropped and a *clone* of the input would be returned, if `n` is bigger then data.length no items would be returned.
 * @param rules - A variadic array of order rules defining the sorting criteria. Each order rule is a projection function that extracts a comparable value from the data. Sorting is based on these extracted values using the native `<` and `>` operators. Earlier rules take precedence over later ones. Use the syntax `[projection, "desc"]` for descending order.
 * @returns a subset of the input array.
 * @signature
 *   P.dropFirstBy(n, ...rules)(data);
 * @example
 *   P.pipe(['aa', 'aaaa', 'a', 'aaa'], P.dropFirstBy(2, x => x.length)); // => ['aaa', 'aaaa']
 * @dataLast
 * @category Array
 */
export function dropFirstBy<T>(
  n: number,
  ...rules: Readonly<NonEmptyArray<OrderRule<T>>>
): (data: ReadonlyArray<T>) => Array<T>;

export function dropFirstBy(...args: Array<any>): unknown {
  return purryOrderRulesWithArgument(dropFirstByImplementation, args);
}

function dropFirstByImplementation<T>(
  data: ReadonlyArray<T>,
  compareFn: CompareFunction<T>,
  n: number,
): Array<T> {
  if (n >= data.length) {
    return [];
  }

  if (n <= 0) {
    return data.slice();
  }

  const heap = data.slice(0, n);
  heapify(heap, compareFn);

  const out = [];

  const rest = data.slice(n);
  for (const item of rest) {
    const previousHead = heapMaybeInsert(heap, compareFn, item);
    out.push(previousHead ?? item);
  }

  return out;
}
