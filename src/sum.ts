import type { IterableContainer } from './internal/types/iterable-container';

import { curry } from './curry';

type Sum<T extends IterableContainer<bigint> | IterableContainer<number>> =
  // Empty arrays would always result in a product of (a non-bigint) 1
  T extends readonly []
    ? 0
    : // Non-empty bigint arrays will always result in a bigint sum.
    T extends readonly [bigint, ...ReadonlyArray<unknown>]
      ? bigint
      : // But an empty bigint array would result in a non-bigint 0.
      T[number] extends bigint
        ? 0 | bigint
        : // Non-bigint arrays are always handled correctly.
        number;

/**
 * Sums the numbers in the array, or return 0 for an empty array.
 *
 * Works for both `number` and `bigint` arrays, but not arrays that contain both
 * types.
 *
 * IMPORTANT: The result for empty arrays would be 0 (`number`) regardless of
 * the type of the array; to avoid adding this to the return type for cases
 * where the array is known to be non-empty you can use `hasAtLeast` or
 * `isEmpty` to guard against this case.
 *
 * @param data - The array of numbers.
 * @signature
 *   P.sum(data);
 * @example
 *   P.sum([1, 2, 3]); // => 6
 *   P.sum([1n, 2n, 3n]); // => 6n
 *   P.sum([]); // => 0
 * @dataFirst
 * @category Number
 */
export function sum<
  T extends IterableContainer<bigint> | IterableContainer<number>,
>(data: T): Sum<T>;

/**
 * Sums the numbers in the array, or return 0 for an empty array.
 *
 * Works for both `number` and `bigint` arrays, but not arrays that contain both
 * types.
 *
 * IMPORTANT: The result for empty arrays would be 0 (`number`) regardless of
 * the type of the array; to avoid adding this to the return type for cases
 * where the array is known to be non-empty you can use `hasAtLeast` or
 * `isEmpty`to guard against this case.
 *
 * @signature
 *   P.sum()(data);
 * @example
 *   P.pipe([1, 2, 3], P.sum()); // => 6
 *   P.pipe([1n, 2n, 3n], R.sum()); // => 6n
 *   P.pipe([], P.sum()); // => 0
 * @dataLast
 * @category Number
 */
export function sum(): <
  T extends IterableContainer<bigint> | IterableContainer<number>,
>(
  data: T,
) => Sum<T>;

export function sum(...args: ReadonlyArray<unknown>): unknown {
  return curry(sumImplementation, args);
}

function sumImplementation<
  T extends IterableContainer<bigint> | IterableContainer<number>,
>(data: T): T[number] {
  let out = typeof data[0] === 'bigint' ? 0n : 0;
  for (const value of data) {
    // @ts-expect-error [ts2365] -- Typescript can't infer that all elements will be a number of the same type.

    out += value;
  }
  return out;
}
