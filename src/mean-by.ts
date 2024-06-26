import { curry } from './curry';

/**
 * Returns the mean of the elements of an array using the provided predicate.
 *
 * @param fn - Predicate function.
 * @signature
 *   P.meanBy(fn)(array)
 * @example
 *    P.pipe(
 *      [{a: 5}, {a: 1}, {a: 3}],
 *      P.meanBy(x => x.a)
 *    ) // 3
 * @dataLast
 * @category Array
 */

export function meanBy<T>(
  fn: (value: T, index: number, data: ReadonlyArray<T>) => number,
): (items: ReadonlyArray<T>) => number;

/**
 * Returns the mean of the elements of an array using the provided predicate.
 *
 * @param items - The array.
 * @param fn - Predicate function.
 * @signature
 *   P.meanBy(array, fn)
 * @example
 *    P.meanBy(
 *      [{a: 5}, {a: 1}, {a: 3}],
 *      x => x.a
 *    ) // 3
 * @dataFirst
 * @category Array
 */

export function meanBy<T>(
  items: ReadonlyArray<T>,
  fn: (value: T, index: number, data: ReadonlyArray<T>) => number,
): number;

export function meanBy(...args: ReadonlyArray<unknown>): unknown {
  return curry(meanByImplementation, args);
}

function meanByImplementation<T>(
  array: ReadonlyArray<T>,
  fn: (value: T, index: number, data: ReadonlyArray<T>) => number,
): number {
  if (array.length === 0) {
    return Number.NaN;
  }

  let sum = 0;

  for (const [index, item] of array.entries()) {
    sum += fn(item, index, array);
  }

  return sum / array.length;
};
