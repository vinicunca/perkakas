import type { EnumerableStringKeyedValueOf } from './internal/types/enumerable-string-keyed-value-of';
import type { IterableContainer } from './internal/types/iterable-container';
import { curry } from './curry';

type Values<T extends object> = T extends IterableContainer
  ? Array<T[number]>
  : Array<EnumerableStringKeyedValueOf<T>>;

/**
 * Returns a new array containing the values of the array or object.
 *
 * @param data - Either an array or an object.
 * @signature
 *    P.values(source)
 * @example
 *    P.values(['x', 'y', 'z']) // => ['x', 'y', 'z']
 *    P.values({ a: 'x', b: 'y', c: 'z' }) // => ['x', 'y', 'z']
 * @dataFirst
 * @category Object
 */
export function values<T extends object>(data: T): Values<T>;

/**
 * Returns a new array containing the values of the array or object.
 *
 * @signature
 *    P.values()(source)
 * @example
 *    P.pipe(['x', 'y', 'z'], P.values()) // => ['x', 'y', 'z']
 *    P.pipe({ a: 'x', b: 'y', c: 'z' }, P.values()) // => ['x', 'y', 'z']
 *    P.pipe(
 *      { a: 'x', b: 'y', c: 'z' },
 *      P.values(),
 *      P.first(),
 *    ) // => 'x'
 * @dataLast
 * @category Object
 */
export function values(): <T extends object>(data: T) => Values<T>;

export function values(...args: ReadonlyArray<unknown>): unknown {
  return curry(Object.values, args);
}
