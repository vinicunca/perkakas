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
 * @param array - The array.
 * @signature
 *    P.reverse(arr);
 * @example
 *    P.reverse([1, 2, 3]) // [3, 2, 1]
 * @dataFirst
 * @category Array
 */
export function reverse<T extends ReadonlyArray<unknown>>(array: T): Reverse<T>;

/**
 * Reverses array.
 *
 * @signature
 *    P.reverse()(array);
 * @example
 *    P.reverse()([1, 2, 3]) // [3, 2, 1]
 * @dataLast
 * @category Array
 */
export function reverse<T extends ReadonlyArray<unknown>>(): (
  array: T,
) => Reverse<T>;

export function reverse(...args: ReadonlyArray<unknown>): unknown {
  return curry(reverseImplementation, args);
}

function reverseImplementation<T>(array: ReadonlyArray<T>): Array<T> {
  // TODO: When node 18 reaches end-of-life bump target lib to ES2023+ and use `Array.prototype.toReversed` here.
  return [...array].reverse();
}
