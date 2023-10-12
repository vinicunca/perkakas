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

type Values<T extends object> = T extends ReadonlyArray<unknown> | []
  ? Array<T[number]>
  : Array<T[keyof T]>;

export function values<T extends object>(source: T): Values<T> {
  return Object.values(source) as Values<T>;
}
