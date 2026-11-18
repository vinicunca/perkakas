import { curry } from './curry';

type Reverse<
  T extends ReadonlyArray<unknown>,
  R extends ReadonlyArray<unknown> = [],
> = ReturnType<
  T extends IsNoTuple<T>
    ? () => [...T, ...R]
    : T extends readonly [infer F, ...infer L]
      ? () => Reverse<L, [F, ...R]>
      : () => R
>;

type IsNoTuple<T> = T extends readonly [unknown, ...Array<unknown>] ? never : T;

/**
 * Reverses array.
 *
 * @param data - The array.
 * @signature
 *    reverse(data);
 * @example
 *    reverse([1, 2, 3]); // [3, 2, 1]
 * @dataFirst
 * @category Array
 */
export function reverse<T extends ReadonlyArray<unknown>>(data: T): Reverse<T>;

/**
 * Reverses array.
 *
 * @signature
 *    reverse()(data);
 * @example
 *    reverse()([1, 2, 3]); // [3, 2, 1]
 * @dataLast
 * @category Array
 */
export function reverse<T extends ReadonlyArray<unknown>>(): (
  data: T,
) => Reverse<T>;

export function reverse(...args: ReadonlyArray<unknown>): unknown {
  return curry(reverseImplementation, 1, args);
}

function reverseImplementation<T>(data: ReadonlyArray<T>): Array<T> {
  // eslint-disable-next-line unicorn/no-array-reverse -- `reverse` only mutates our own copy here, and `toReversed` is slower on larger arrays.
  return data.concat().reverse();
}
