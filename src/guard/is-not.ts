/**
 * A function that takes a guard function as predicate and returns a guard that negates it
 * @param predicate the guard function to negate
 * @signature
 *    P.isNot(P.isTruthy)(data)
 * @returns function A guard function
 * @example
 *    P.isNot(P.isTruthy)(false) //=> true
 *    P.isNot(P.isTruthy)(true) //=> false
 * @dataLast
 * @category Guard
 */
export function isNot<T, S extends T>(
  predicate: (data: T) => data is S,
): (data: T) => data is Exclude<T, S>;
export function isNot<T>(predicate: (data: T) => boolean): (data: T) => boolean;

export function isNot<T>(predicate: (data: T) => boolean) {
  return (data: T): boolean => !predicate(data);
}
