import { purry } from '../function/purry';

/**
 * Returns an array of key/values of the enumerable properties of an object.
 * @param object
 * @signature
 *    P.toPairs(object)
 *    P.toPairs.strict(object)
 * @example
 *    P.toPairs({ a: 1, b: 2, c: 3 }) // => [['a', 1], ['b', 2], ['c', 3]]
 *    P.toPairs.strict({ a: 1 } as const) // => [['a', 1]] typed Array<['a', 1]>
 *    P.pipe(
 *      { a: 1, b: 2, c: 3 },
 *      toPairs,
 *    ); // => [['a', 1], ['b', 2], ['c', 3]]
 *    P.pipe(
 *      { a: 1 } as const,
 *      toPairs.strict,
 *    ); // => [['a', 1]] typed Array<['a', 1]>
 * @strict
 * @category Object
 * @dataFirst
 */
export function toPairs<T>(object: Record<string, T>): Array<[string, T]>;

/**
 * Returns an array of key/values of the enumerable properties of an object.
 * @param object
 * @signature
 *    P.toPairs()(object)
 *    P.toPairs.strict()(object)
 * @example
 *    P.pipe(
 *      { a: 1, b: 2, c: 3 },
 *      toPairs(),
 *    ); // => [['a', 1], ['b', 2], ['c', 3]]
 *    P.pipe(
 *      { a: 1 } as const,
 *      toPairs.strict(),
 *    ); // => [['a', 1]] typed Array<['a', 1]>
 * @strict
 * @category Object
 * @dataLast
 */
// TODO: Currently the typings are broken
// export function toPairs(): <T>(object: Record<string, T>) => Array<[string, T]>;

export function toPairs(...args: any[]) {
  return purry(Object.entries, args);
}

type Pairs<T> = Array<
  { [K in keyof T]-?: [key: K, value: Required<T>[K]] }[keyof T]
>;

interface Strict {
  <T extends NonNullable<unknown>>(object: T): Pairs<T>;
  // TODO: Currently the typings are broken
  // (): <T extends NonNullable<unknown>>(object: T) => Pairs<T>;
}

export namespace toPairs {
  export const strict = toPairs as Strict;
}
