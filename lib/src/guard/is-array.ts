type DefinitelyArray<T> = Extract<
  T,
  Array<any> | ReadonlyArray<any>
> extends never
  ? ReadonlyArray<unknown>
  : Extract<T, Array<any> | ReadonlyArray<any>>;
/**
 * A function that checks if the passed parameter is an Array and narrows its type accordingly
 * @param data the variable to check
 * @signature
 *    P.isArray(data)
 * @returns true if the passed input is an Array, false otherwise
 * @example
 *    P.isArray([5]) //=> true
 *    P.isArray([]) //=> true
 *    P.isArray('somethingElse') //=> false
 * @category Guard
 */
export function isArray<T>(
  data: T | ReadonlyArray<unknown>,
): data is DefinitelyArray<T> {
  return Array.isArray(data);
}
