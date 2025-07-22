import type { IterableContainer } from './internal/types/iterable-container';

import { curry } from './curry';

type Product<T extends IterableContainer<bigint> | IterableContainer<number>>
  // Empty arrays would always result in a product of (a non-bigint) 1
  = T extends readonly []
    ? 1
    // Non-empty bigint arrays will always result in a bigint product.
    : T extends readonly [bigint, ...ReadonlyArray<unknown>]
      ? bigint
      // But an empty bigint array would result in a non-bigint 1.
      : T[number] extends bigint
        ? 1 | bigint
        // Non-bigint arrays are always handled correctly.
        : number;

/**
 * Compute the product of the numbers in the array, or return 1 for an empty
 * array.
 *
 * Works for both `number` and `bigint` arrays, but not arrays that contain both
 * types.
 *
 * IMPORTANT: The result for empty arrays would be 1 (`number`) regardless of
 * the type of the array; to avoid adding this to the return type for cases
 * where the array is known to be non-empty you can use `hasAtLeast` or
 * `isEmpty` to guard against this case.
 *
 * @param data - The array of numbers.
 * @signature
 *   P.product(data);
 * @example
 *   P.product([1, 2, 3]); // => 6
 *   P.product([1n, 2n, 3n]); // => 6n
 *   P.product([]); // => 1
 * @dataFirst
 * @category Number
 */
export function product<
  T extends IterableContainer<bigint> | IterableContainer<number>,
>(data: T): Product<T>;

/**
 * Compute the product of the numbers in the array, or return 1 for an empty
 * array.
 *
 * Works for both `number` and `bigint` arrays, but not arrays that contain both
 * types.
 *
 * IMPORTANT: The result for empty arrays would be 1 (`number`) regardless of
 * the type of the array; to avoid adding this to the return type for cases
 * where the array is known to be non-empty you can use `hasAtLeast` or
 * `isEmpty` to guard against this case.
 *
 * @signature
 *   P.product()(data);
 * @example
 *   P.pipe([1, 2, 3], P.product()); // => 6
 *   P.pipe([1n, 2n, 3n], R.product()); // => 6n
 *   P.pipe([], P.product()); // => 1
 * @dataLast
 * @category Number
 */
export function product(): <
  T extends IterableContainer<bigint> | IterableContainer<number>,
>(
  data: T,
) => Product<T>;

export function product(...args: ReadonlyArray<unknown>): unknown {
  return curry(productImplementation, args);
}

function productImplementation<
  T extends IterableContainer<bigint> | IterableContainer<number>,
>(data: T): T[number] {
  let out = typeof data[0] === 'bigint' ? 1n : 1;
  for (const value of data) {
    // @ts-expect-error [ts2365] -- Typescript can't infer that all elements will be a number of the same type.
    out *= value;
  }
  return out;
}
