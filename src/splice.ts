import { purry } from './purry';

/**
 * Removes elements from an array and, inserts new elements in their place.
 *
 * @param items the array to splice.
 * @param start the index from which to start removing elements.
 * @param deleteCount the number of elements to remove.
 * @param replacement the elements to insert into the array in place of the deleted elements.
 * @signature
 *  splice(items, start, deleteCount, replacement)
 * @example
 *  import { splice } from '@vinicunca/perkakas';
 *
 *  splice([1,2,3,4,5,6,7,8], 2, 3, []); // => [1,2,6,7,8]
 *  splice([1,2,3,4,5,6,7,8], 2, 3, [9, 10]); // => [1,2,9,10,6,7,8]
 * @dataFirst
 * @category Array
 */
export function splice<T>(
  items: ReadonlyArray<T>,
  start: number,
  deleteCount: number,
  replacement: ReadonlyArray<T>
): Array<T>;

/**
 * Removes elements from an array and, inserts new elements in their place.
 *
 * @param start the index from which to start removing elements.
 * @param deleteCount the number of elements to remove.
 * @param replacement the elements to insert into the array in place of the deleted elements.
 * @signature
 *  splice(start, deleteCount, replacement)(items)
 * @example
 *  import { splice, pipe } from '@vinicunca/perkakas';
 *
 *  pipe([1,2,3,4,5,6,7,8], splice(2, 3, [])) // => [1,2,6,7,8]
 *  pipe([1,2,3,4,5,6,7,8], splice(2, 3, [9, 10])) // => [1,2,9,10,6,7,8]
 * @dataLast
 * @category Array
 */
export function splice<T>(
  start: number,
  deleteCount: number,
  replacement: ReadonlyArray<T>
): (items: ReadonlyArray<T>) => Array<T>;

export function splice(...args: Array<any>): unknown {
  return purry(splice_, args);
}

function splice_<T>(
  items: ReadonlyArray<T>,
  start: number,
  deleteCount: number,
  replacement: ReadonlyArray<T>,
): Array<T> {
  const result = items.slice();
  result.splice(start, deleteCount, ...replacement);
  return result;
}
