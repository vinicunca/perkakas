import { purry } from '../function/purry';
import { binarySearchCutoffIndex } from '../utils/binary-search-cutoff-index';

/**
 * Find the insertion position (index) of an item in an array with items sorted
 * in ascending order; so that `splice(sortedIndex, 0, item)` would result in
 * maintaining the array's sort-ness. The array can contain duplicates.
 * If the item already exists in the array the index would be of the *first*
 * occurrence of the item.
 *
 * Runs in O(logN) time.
 *
 * @param data - The (ascending) sorted array.
 * @param item - The item to insert.
 * @return - Insertion index (In the range 0..array.length)
 *
 * @signature
 *    P.sortedIndex(data, item)
 * @example
 *    P.sortedIndex(['a','a','b','c','c'], 'c') // => 3
 * @dataFirst
 * @category Array
 *
 * @see sortedIndexBy, sortedIndexWith, sortedLastIndex, sortedLastIndexBy
 */
export function sortedIndex<T>(data: ReadonlyArray<T>, item: T): number;

/**
 * Find the insertion position (index) of an item in an array with items sorted
 * in ascending order; so that `splice(sortedIndex, 0, item)` would result in
 * maintaining the array's sort-ness. The array can contain duplicates.
 * If the item already exists in the array the index would be of the *first*
 * occurrence of the item.
 *
 * Runs in O(logN) time.
 *
 * @param data - The (ascending) sorted array.
 * @param item - The item to insert.
 * @return - Insertion index (In the range 0..array.length)
 *
 * @signature
 *    P.sortedIndex(item)(data)
 * @example
 *    P.pipe(['a','a','b','c','c'], P.sortedIndex('c')) // => 3
 * @dataLast
 * @category Array
 *
 * @see sortedIndexBy, sortedIndexWith, sortedLastIndex, sortedLastIndexBy
 */
export function sortedIndex<T>(item: T): (data: ReadonlyArray<T>) => number;

export function sortedIndex(...args: any[]): unknown {
  return purry(sortedIndexImplementation, args);
}

function sortedIndexImplementation<T>(array: ReadonlyArray<T>,
  item: T): number {
  return binarySearchCutoffIndex(array, (pivot) => pivot < item);
}
