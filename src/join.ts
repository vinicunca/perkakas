import type { Join } from 'type-fest';

import { curry } from './curry';

// Copied from type-fest, from the Join type.
type JoinableItem = bigint | boolean | null | number | string | undefined;

/**
 * Joins the elements of the array by: casting them to a string and
 * concatenating them one to the other, with the provided glue string in between
 * every two elements.
 *
 * When called on a tuple and with stricter item types (union of literal values,
 * the result is strictly typed to the tuples shape and it's item types).
 *
 * @param data - The array to join.
 * @param glue - The string to put in between every two elements.
 * @signature
 *    P.join(data, glue)
 * @example
 *    P.join([1,2,3], ",") // => "1,2,3" (typed `string`)
 *    P.join(['a','b','c'], "") // => "abc" (typed `string`)
 *    P.join(['hello', 'world'] as const, " ") // => "hello world" (typed `hello world`)
 * @dataFirst
 * @category Array
 */
export function join<
  T extends [] | ReadonlyArray<JoinableItem>,
  Glue extends string,
>(data: T, glue: Glue): Join<T, Glue>;

/**
 * Joins the elements of the array by: casting them to a string and
 * concatenating them one to the other, with the provided glue string in between
 * every two elements.
 *
 * When called on a tuple and with stricter item types (union of literal values,
 * the result is strictly typed to the tuples shape and it's item types).
 *
 * @param glue - The string to put in between every two elements.
 * @signature
 *    P.join(glue)(data)
 * @example
 *    P.pipe([1,2,3], P.join(",")) // => "1,2,3" (typed `string`)
 *    P.pipe(['a','b','c'], P.join("")) // => "abc" (typed `string`)
 *    P.pipe(['hello', 'world'] as const, P.join(" ")) // => "hello world" (typed `hello world`)
 * @dataLast
 * @category Array
 */
export function join<
  T extends [] | ReadonlyArray<JoinableItem>,
  Glue extends string,
>(glue: Glue): (data: T) => Join<T, Glue>;

export function join(...args: ReadonlyArray<unknown>): unknown {
  return curry(joinImplementation, args);
}

function joinImplementation(
  data: ReadonlyArray<unknown>,
  glue: string,
): string {
  return data.join(glue);
};
