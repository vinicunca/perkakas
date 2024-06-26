import { curry } from './curry';

type Enumerable<T> = ArrayLike<T> | Iterable<T>;

/**
 * Counts values of the collection or iterable.
 *
 * @param items - The input data.
 * @signature
 *    P.length(array)
 * @example
 *    P.length([1, 2, 3]) // => 3
 * @dataFirst
 * @category Array
 */
export function length<T>(items: Enumerable<T>): number;

/**
 * Counts values of the collection or iterable.
 *
 * @signature
 *    P.length()(array)
 * @example
 *    P.pipe([1, 2, 3], P.length()) // => 3
 * @dataLast
 * @category Array
 */
export function length<T>(): (items: Enumerable<T>) => number;

export function length(...args: ReadonlyArray<unknown>): unknown {
  return curry(lengthImplementation, args);
}

function lengthImplementation<T>(items: Enumerable<T>): number {
  return 'length' in items ? items.length : [...items].length;
}
