import type { IterableContainer } from '../utils/types';

import { purry } from '../function';

type Joinable = bigint | boolean | null | number | string | undefined;

export type Joined<T extends IterableContainer, Glue extends string> =
  // Empty tuple
  T[number] extends never
    ? ''
    : // Single item tuple (could be optional too!)
    T extends readonly [Joinable?]
      ? `${NullishCoalesce<T[0], ''>}`
      : // Tuple with non-rest element (head)
      T extends readonly [infer First, ...infer Tail]
        ? `${NullishCoalesce<First, ''>}${Glue}${Joined<Tail, Glue>}`
        : // Tuple with non-rest element (tail)
        T extends readonly [...infer Head, infer Last]
          ? `${Joined<Head, Glue>}${Glue}${NullishCoalesce<Last, ''>}`
          : // Arrays and tuple rest-elements, we can't say anything about the output
          string;

// `undefined` and `null` are special-cased by join. In typescript
// `${undefined}` === 'undefined' (and similarly for null), but specifically in
// the builtin `join` method, they should result in an empty string!
// @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join#description
type NullishCoalesce<T, Fallback> = T extends Joinable
  ? T extends null | undefined
    ? Fallback | NonNullable<T>
    : T
  : never;

/**
 * Joins the elements of the array by: casting them to a string and
 * concatenating them one to the other, with the provided glue string in between
 * every two elements.
 *
 * When called on a tuple and with stricter item types (union of literal values,
 * the result is strictly typed to the tuples shape and it's item types).
 *
 * @param data The array to join
 * @param glue The string to put in between every two elements
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
  T extends [] | ReadonlyArray<Joinable>,
  Glue extends string,
>(data: T, glue: Glue): Joined<T, Glue>;

/**
 * Joins the elements of the array by: casting them to a string and
 * concatenating them one to the other, with the provided glue string in between
 * every two elements.
 *
 * When called on a tuple and with stricter item types (union of literal values,
 * the result is strictly typed to the tuples shape and it's item types).
 *
 * @param glue The string to put in between every two elements
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
  T extends [] | ReadonlyArray<Joinable>,
  Glue extends string,
>(glue: Glue): (data: T) => Joined<T, Glue>;

export function join(...args: any[]): unknown {
  return purry(joinImplementation, args);
}

function joinImplementation(data: ReadonlyArray<unknown>, glue: string): string {
  return data.join(glue);
}
