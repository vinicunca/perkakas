/**
 * A function that always returns the param passed to it
 * @signature
 *  identity(data)
 * @example
 *  import { identity } from '@vinicunca/perkakas';
 *
 *  identity('foo'); // => 'foo'
 * @category Function
 */
export function identity<T>(value: T) {
  return value;
}
