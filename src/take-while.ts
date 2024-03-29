import { purry } from './purry';

/**
 * Returns elements from the array until predicate returns false.
 *
 * @param array the array
 * @param fn the predicate
 * @signature
 *  takeWhile(array, fn)
 * @example
 *  import { takeWhile } from '@vicnunca/perkakas';
 *
 *  takeWhile([1, 2, 3, 4, 3, 2, 1], x => x !== 4) // => [1, 2, 3]
 * @dataFirst
 * @category Array
 */
export function takeWhile<T>(
  array: ReadonlyArray<T>,
  fn: (item: T) => boolean
): Array<T>;

/**
 * Returns elements from the array until predicate returns false.
 *
 * @param fn the predicate
 * @signature
 *  takeWhile(fn)(array)
 * @example
 *  import { takeWhile, pipe } from '@vicnunca/perkakas';
 *
 *  pipe([1, 2, 3, 4, 3, 2, 1], takeWhile(x => x !== 4))  // => [1, 2, 3]
 * @dataLast
 * @category Array
 */
export function takeWhile<T>(
  fn: (item: T) => boolean
): (array: ReadonlyArray<T>) => Array<T>;

export function takeWhile(...args: Array<any>): unknown {
  return purry(takeWhile_, args);
}

function takeWhile_<T>(
  array: ReadonlyArray<T>,
  fn: (item: T) => boolean,
): Array<T> {
  const ret: Array<T> = [];
  for (const item of array) {
    if (!fn(item)) {
      break;
    }
    ret.push(item);
  }
  return ret;
}
