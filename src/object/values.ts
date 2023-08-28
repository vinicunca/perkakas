/**
 * Returns a new array containing the values of the array or object.
 * @param source Either an array or an object
 * @signature
 *    P.values(source)
 * @example
 *    P.values(['x', 'y', 'z']) // => ['x', 'y', 'z']
 *    P.values({ a: 'x', b: 'y', c: 'z' }) // => ['x', 'y', 'z']
 *    P.pipe(
 *      { a: 'x', b: 'y', c: 'z' },
 *      P.values,
 *      P.first
 *    ) // => 'x'
 * @pipeable
 * @category Object
 */

export function values<T>(
  source: Record<PropertyKey, T> | ArrayLike<T>,
): Array<T> {
  return Object.values(source);
}
