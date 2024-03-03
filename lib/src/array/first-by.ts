import type { CompareFunction, IterableContainer, NonEmptyArray } from '../utils/types';

import { type OrderRule, purryOrderRules } from '../utils/purry-order-rules';
import { hasAtLeast } from './has-at-least';

type FirstBy<T extends IterableContainer> =
  | (T extends readonly [unknown, ...ReadonlyArray<unknown>]
    ? never
    : T extends readonly [...ReadonlyArray<unknown>, unknown]
      ? never
      : undefined)
      | T[number];

/**
 * Find the first element in the array that adheres to the order rules provided. This is a superset of what a typical `maxBy` or `minBy` function would do as it allows defining "tie-breaker" rules when values are equal, and allows comparing items using any logic. This function is equivalent to calling `P.first(P.sortBy(...))` but runs at *O(n)* instead of *O(nlogn)*.
 *
 * Use `nthBy` if you need an element other that the first, or `takeFirstBy` if you more than just the first element.
 *
 * @param data an array of items
 * @param rules - A variadic array of order rules defining the sorting criteria. Each order rule is a projection function that extracts a comparable value from the data. Sorting is based on these extracted values using the native `<` and `>` operators. Earlier rules take precedence over later ones. Use the syntax `[projection, "desc"]` for descending ordeP.
 * @returns the first element by the order criteria, or `undefined` if the array
 * is empty. (The function provides strong typing if the input type assures the
 * array isn't empty).
 * @signature
 *   P.firstBy(...rules)(data);
 * @example
 *   const max = P.pipe([1,2,3], P.firstBy([P.identity, "desc"])); // => 3;
 *   const min = P.pipe([1,2,3], P.firstBy([1,2,3])); // => 1;
 *
 *   const data = [{ a: "a" }, { a: "aa" }, { a: "aaa" }] as const;
 *   const maxBy = P.pipe(data, P.firstBy([(item) => item.a.length, "desc"])); // => { a: "aaa" };
 *   const minBy = P.pipe(data, P.firstBy((item) => item.a.length)); // => { a: "a" };
 *
 *   const data = [{type: "cat", size: 1}, {type: "cat", size: 2}, {type: "dog", size: 3}] as const;
 *   const multi = P.pipe(data, P.firstBy(P.prop('type'), [P.prop('size'), 'desc'])); // => {type: "cat", size: 2}
 * @dataLast
 * @category Array
 */
export function firstBy<T extends IterableContainer>(
  ...rules: Readonly<NonEmptyArray<OrderRule<T[number]>>>
): (data: T) => FirstBy<T>;

/**
 * Find the first element in the array that adheres to the order rules provided. This is a superset of what a typical `maxBy` or `minBy` function would do as it allows defining "tie-breaker" rules when values are equal, and allows comparing items using any logic. This function is equivalent to calling `P.first(P.sortBy(...))` but runs at *O(n)* instead of *O(nlogn)*.
 *
 * Use `nthBy` if you need an element other that the first, or `takeFirstBy` if you more than just the first element.
 *
 * @param data an array of items
 * @param rules - A variadic array of order rules defining the sorting criteria. Each order rule is a projection function that extracts a comparable value from the data. Sorting is based on these extracted values using the native `<` and `>` operators. Earlier rules take precedence over later ones. Use the syntax `[projection, "desc"]` for descending ordeP.
 * @returns the first element by the order criteria, or `undefined` if the array
 * is empty. (The function provides strong typing if the input type assures the
 * array isn't empty).
 * @signature
 *   P.firstBy(data, ...rules);
 * @example
 *   const max = P.firstBy([1,2,3], [P.identity, "desc"]); // => 3;
 *   const min = P.firstBy([1,2,3], P.identity); // => 1;
 *
 *   const data = [{ a: "a" }, { a: "aa" }, { a: "aaa" }] as const;
 *   const maxBy = P.firstBy(data, [(item) => item.a.length, "desc"]); // => { a: "aaa" };
 *   const minBy = P.firstBy(data, (item) => item.a.length); // => { a: "a" };
 *
 *   const data = [{type: "cat", size: 1}, {type: "cat", size: 2}, {type: "dog", size: 3}] as const;
 *   const multi = P.firstBy(data, P.prop('type'), [P.prop('size'), 'desc']); // => {type: "cat", size: 2}
 * @dataFirst
 * @category Array
 */
export function firstBy<T extends IterableContainer>(
  data: T,
  ...rules: Readonly<NonEmptyArray<OrderRule<T[number]>>>
): FirstBy<T>;

export function firstBy(...args: any[]): unknown {
  return purryOrderRules(firstByImplementation, args);
}

function firstByImplementation<T>(
  data: ReadonlyArray<T>,
  compareFn: CompareFunction<T>,
): T | undefined {
  if (!hasAtLeast(data, 2)) {
    // If we have 0 or 1 item we simply return the trivial result.
    return data[0];
  }

  let [currentFirst] = data;

  // Remove the first item, we won't compare it with itself.
  const [, ...rest] = data;
  for (const item of rest) {
    if (compareFn(item, currentFirst) < 0) {
      // item comes before currentFirst in the order.
      currentFirst = item;
    }
  }

  return currentFirst;
}
