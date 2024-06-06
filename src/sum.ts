import type { NonEmptyArray } from './helpers/types';

import { curry } from './curry';

/**
 * Sums the numbers in the array, or return 0 for an empty array.
 *
 * @param data - The array of numbers.
 * @signature
 *   P.sum(data);
 * @example
 *   P.sum([1, 2, 3]); // => 6
 *   P.sum([]); // => 0
 * @dataFirst
 * @category Number
 */
export function sum(data: ReadonlyArray<number>): number;
export function sum(data: Readonly<NonEmptyArray<bigint>>): bigint;

/**
 * Sums the numbers in the array, or return 0 for an empty array.
 *
 * @signature
 *   P.sum()(data);
 * @example
 *   P.pipe([1, 2, 3], P.sum()); // => 6
 *   P.pipe([], P.sum()); // => 0
 * @dataLast
 * @category Number
 */
export function sum(): (data: ReadonlyArray<number>) => number;
export function sum(): (data: Readonly<NonEmptyArray<bigint>>) => bigint;

export function sum(...args: ReadonlyArray<unknown>): unknown {
  return curry(sumImplementation, args);
}

function sumImplementation<
  T extends ReadonlyArray<bigint> | ReadonlyArray<number>,
>(data: T): T[number] {
  let out = typeof data[0] === 'bigint' ? 0n : 0;
  for (const value of data) {
    // @ts-expect-error [ts2365] -- Typescript can't infer that all elements will be a number of the same type.

    out += value;
  }
  return out;
}
