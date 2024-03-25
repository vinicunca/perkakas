/**
 * A function that always returns the param passed to it
 * @signature
 *    identity(data)
 * @example
 *    identity('foo') // => 'foo'
 * @category Function
 */
export function identity<T>(value: T) {
  return value;
}
