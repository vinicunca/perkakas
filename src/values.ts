/**
 * Returns a new array containing the values of the array or object.
 *
 * @param source Either an array or an object
 * @signature
 *  values(source)
 * @example
 *  values(['x', 'y', 'z']); // => ['x', 'y', 'z']
 *  values({ a: 'x', b: 'y', c: 'z' }); // => ['x', 'y', 'z']
 *  pipe(
 *    { a: 'x', b: 'y', c: 'z' },
 *  values,
 *  first
 *  ); // => 'x'
 * @pipeable
 * @category Object
 */

type Values<T extends object> = T extends [] | ReadonlyArray<unknown>
  ? Array<T[number]>
  : Array<T[keyof T]>;

export function values<T extends object>(source: T): Values<T> {
  return Object.values(source) as Values<T>;
}
