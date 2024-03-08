import { purry } from '../function/purry';

type Enumerable<T> = ArrayLike<T> | Iterable<T>;

/**
 * Counts values of the collection or iterable.
 * @param items The input data.
 * @signature
 *    P.length(array)
 * @example
 *    P.length([1, 2, 3]) // => 3
 * @category Array
 */
export function length<T>(items: Enumerable<T>): number;
export function length<T>(): (items: Enumerable<T>) => number;

/**
 * Counts values of the collection or iterable.
 * @signature
 *    P.length()(array)
 * @example
 *    P.pipe([1, 2, 3], P.length()) // => 3
 * @category Array
 */
export function length(...args: any[]): unknown {
  return purry(length_, args);
}

function length_<T>(items: Enumerable<T>): number {
  return 'length' in items ? items.length : Array.from(items).length;
}
