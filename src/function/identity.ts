/**
 * A function that always returns the param passed to it
 * @signature
 *    P.identity(data)
 * @example
 *    P.identity('foo') // => 'foo'
 * @category Function
 */
export function identity<T>(value: T) {
  return value;
}
