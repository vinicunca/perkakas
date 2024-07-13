import { curry } from './curry';

/**
 * Determines whether two values are *functionally identical* in all contexts.
 * For primitive values (string, number), this is done by-value, and for objects
 * it is done by-reference (i.e., they point to the same object in memory).
 *
 * Under the hood we use **both** the [`===` operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality)
 * and [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). This means that `isStrictEqual(NaN, NaN) === true`
 * (whereas `NaN !== NaN`), and `isStrictEqual(-0, 0) === true` (whereas
 * `Object.is(-0, 0) === false`).
 *
 * The result would be narrowed to the second value so that the function can be
 * used as a type guard.
 *
 * See:
 * - `isDeepEqual` for a semantic comparison that allows comparing arrays and
 * objects "by-value", and recurses for every item.
 * - `isShallowEqual` if you need to compare arrays and objects "by-value" but
 * don't want to recurse into their values.
 *
 * @param data - The first value to compare.
 * @param other - The second value to compare.
 * @signature
 *    P.isStrictEqual(data, other)
 * @example
 *    P.isStrictEqual(1, 1) //=> true
 *    P.isStrictEqual(1, '1') //=> false
 *    P.isStrictEqual([1, 2, 3], [1, 2, 3]) //=> false
 * @dataFirst
 * @category Guard
 */
export function isStrictEqual<T, S extends T>(
  data: T,
  other: T extends Exclude<T, S> ? S : never,
): data is S;
export function isStrictEqual<T, S extends T = T>(data: T, other: S): boolean;

/**
 * Determines whether two values are *functionally identical* in all contexts.
 * For primitive values (string, number), this is done by-value, and for objects
 * it is done by-reference (i.e., they point to the same object in memory).
 *
 * Under the hood we use **both** the [`===` operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality)
 * and [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). This means that `isStrictEqual(NaN, NaN) === true`
 * (whereas `NaN !== NaN`), and `isStrictEqual(-0, 0) === true` (whereas
 * `Object.is(-0, 0) === false`).
 *
 * The result would be narrowed to the second value so that the function can be
 * used as a type guard.
 *
 * See:
 * - `isDeepEqual` for a semantic comparison that allows comparing arrays and
 * objects "by-value", and recurses for every item.
 * - `isShallowEqual` if you need to compare arrays and objects "by-value" but
 * don't want to recurse into their values.
 *
 * @param other - The second value to compare.
 * @signature
 *    P.isStrictEqual(other)(data)
 * @example
 *    P.pipe(1, P.isStrictEqual(1)); //=> true
 *    P.pipe(1, P.isStrictEqual('1')); //=> false
 *    P.pipe([1, 2, 3], P.isStrictEqual([1, 2, 3])); //=> false
 * @dataLast
 * @category Guard
 */
export function isStrictEqual<T, S extends T>(
  other: T extends Exclude<T, S> ? S : never,
): (data: T) => data is S;
export function isStrictEqual<S>(
  other: S,
): <T extends S = S>(data: T) => boolean;

export function isStrictEqual(...args: ReadonlyArray<unknown>): unknown {
  return curry(isStrictlyEqualImplementation, args);
}

function isStrictlyEqualImplementation<T, S>(data: S | T, other: S): data is S {
  return data === other || Object.is(data, other);
}
