import { purry } from './purry';

/**
 * Returns an array of key/values of the enumerable properties of an object.
 * @param object
 * @signature
 *  toPairs(object)
 *  toPairs.strict(object)
 * @example
 *  toPairs({ a: 1, b: 2, c: 3 }); // => [['a', 1], ['b', 2], ['c', 3]]
 *  toPairs.strict({ a: 1 } as const); // => [['a', 1]] typed Array<['a', 1]>
 *  pipe(
 *    { a: 1, b: 2, c: 3 },
 *    toPairs,
 *  ); // => [['a', 1], ['b', 2], ['c', 3]]
 *  pipe(
 *    { a: 1 } as const,
 *    toPairs.strict,
 *  ); // => [['a', 1]] typed Array<['a', 1]>
 * @strict
 * @category Object
 * @dataFirst
 */
export function toPairs<T>(
  object: Readonly<Record<string, T>>,
): Array<[string, T]>;

/**
 * Returns an array of key/values of the enumerable properties of an object.
 * @param object
 * @signature
 *  toPairs()(object)
 *  toPairs.strict()(object)
 * @example
 *  pipe(
 *    { a: 1, b: 2, c: 3 },
 *    toPairs(),
 *  ); // => [['a', 1], ['b', 2], ['c', 3]]
 *  pipe(
 *    { a: 1 } as const,
 *    toPairs.strict(),
 *  ); // => [['a', 1]] typed Array<['a', 1]>
 * @strict
 * @category Object
 * @dataLast
 */
// TODO: Currently the typings are broken
// export function toPairs(): <T>(object: Record<string, T>) => Array<[string, T]>;

export function toPairs(...args: Array<any>): unknown {
  return purry(Object.entries, args);
}

type Pairs<T> = Array<
  { [K in keyof T]-?: [key: K, value: Required<T>[K]] }[keyof T]
>;

interface Strict {
  <T extends NonNullable<unknown>>(object: T): Pairs<T>;
 ; // TODO: Currently the typings are broken
 ; // (): <T extends NonNullable<unknown>>(object: T) => Pairs<T>;
}

export namespace toPairs {
  export const strict = toPairs as Strict;
}
