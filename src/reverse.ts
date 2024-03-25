import { purry } from '../purry';

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
 * Reverses an array.
 *
 * @param array the array
 * @signature
 *    reverse(arr);
 * @example
 *    reverse([1, 2, 3]) // [3, 2, 1]
 * @dataFirst
 * @category Array
 */
export function reverse<T extends ReadonlyArray<unknown>>(array: T): Reverse<T>;

/**
 * Reverses an array.
 *
 * @signature
 *    reverse()(array);
 * @example
 *    reverse()([1, 2, 3]) // [3, 2, 1]
 * @dataLast
 * @category Array
 */
export function reverse<T extends ReadonlyArray<unknown>>(): (
  array: T
) => Reverse<T>;

export function reverse(...args: Array<any>): unknown {
  return purry(reverse_, args);
}

function reverse_<T>(array: ReadonlyArray<T>): Array<T> {
  return array.slice().reverse();
}
