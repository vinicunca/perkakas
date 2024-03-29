import { _binarySearchCutoffIndex } from './_binary-search-cutoff-index';
import { purry } from './purry';

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
 *  sortedIndex(data, item)
 * @example
 *  import { sortedIndex } from '@vinicunca/perkakas';
 *
 *  sortedIndex(['a','a','b','c','c'], 'c') // => 3
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
 * @param item - The item to insert.
 * @return - Insertion index (In the range 0..array.length)
 *
 * @signature
 *  sortedIndex(item)(data)
 * @example
 *  import { sortedIndex, pipe } from '@vinicunca/perkakas';
 *
 *  pipe(['a','a','b','c','c'], sortedIndex('c')) // => 3
 * @dataLast
 * @category Array
 *
 * @see sortedIndexBy, sortedIndexWith, sortedLastIndex, sortedLastIndexBy
 */
export function sortedIndex<T>(item: T): (data: ReadonlyArray<T>) => number;

export function sortedIndex(...args: Array<any>): unknown {
  return purry(sortedIndexImplementation, args);
}

function sortedIndexImplementation<T>(array: ReadonlyArray<T>,
  item: T): number {
  return _binarySearchCutoffIndex(array, (pivot) => pivot < item);
}
