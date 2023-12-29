type DefinitelyFunction<T> = Extract<T, Function> extends never
  ? Function
  : Extract<T, Function>;
/**
 * A function that checks if the passed parameter is a Function and narrows its type accordingly
 * @param data the variable to check
 * @signature
 *    P.isFunction(data)
 * @returns true if the passed input is a Function, false otherwise
 * @example
 *    P.isFunction(() => {}) //=> true
 *    P.isFunction('somethingElse') //=> false
 * @category Guard
 */
export function isFunction<T>(
  data: Function | T,
): data is DefinitelyFunction<T> {
  return typeof data === 'function';
}
