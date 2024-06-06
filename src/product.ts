import type { NonEmptyArray } from './helpers/types';

import { curry } from './curry';

/**
 * Compute the product of the numbers in the array, or return 1 for an empty
 * array.
 *
 * @param data - The array of numbers.
 * @signature
 *   P.product(data);
 * @example
 *   P.product([1, 2, 3]); // => 6
 *   P.product([]); // => 1
 * @dataFirst
 * @category Number
 */
export function product(data: ReadonlyArray<number>): number;
export function product(data: Readonly<NonEmptyArray<bigint>>): bigint;

/**
 * Compute the product of the numbers in the array, or return 1 for an empty
 * array.
 *
 * @signature
 *   P.product()(data);
 * @example
 *   P.pipe([1, 2, 3], P.product()); // => 6
 *   P.pipe([], P.product()); // => 1
 * @dataLast
 * @category Number
 */
export function product(): (data: ReadonlyArray<number>) => number;
export function product(): (data: Readonly<NonEmptyArray<bigint>>) => bigint;

export function product(...args: ReadonlyArray<unknown>): unknown {
  return curry(productImplementation, args);
}

function productImplementation<
  T extends ReadonlyArray<bigint> | ReadonlyArray<number>,
>(data: T): T[number] {
  let out = typeof data[0] === 'bigint' ? 1n : 1;
  for (const value of data) {
    // @ts-expect-error [ts2365] -- Typescript can't infer that all elements will be a number of the same type.
    out *= value;
  }
  return out;
}
