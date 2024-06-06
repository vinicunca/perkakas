/**
 * A function that takes a guard function as predicate and returns a guard that negates it.
 *
 * @param predicate - The guard function to negate.
 * @returns Function A guard function.
 * @signature
 *    P.isNot(P.isTruthy)(data)
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
