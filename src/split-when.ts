import { curry } from './curry';

/**
 * Splits a given array at the first index where the given predicate returns true.
 *
 * @param data - The array to split.
 * @param predicate - The predicate.
 * @signature
 *    P.splitWhen(array, fn)
 * @example
 *    P.splitWhen([1, 2, 3], x => x === 2) // => [[1], [2, 3]]
 * @dataFirst
 * @category Array
 */
export function splitWhen<T>(
  data: ReadonlyArray<T>,
  predicate: (item: T, index: number, data: ReadonlyArray<T>) => boolean,
): [Array<T>, Array<T>];

/**
 * Splits a given array at an index where the given predicate returns true.
 *
 * @param predicate - The predicate.
 * @signature
 *    P.splitWhen(fn)(array)
 * @example
 *    P.splitWhen(x => x === 2)([1, 2, 3]) // => [[1], [2, 3]]
 * @dataLast
 * @category Array
 */
export function splitWhen<T>(
  predicate: (item: T, index: number, data: ReadonlyArray<T>) => boolean,
): (array: ReadonlyArray<T>) => [Array<T>, Array<T>];

export function splitWhen(...args: ReadonlyArray<unknown>): unknown {
  return curry(splitWhenImplementation, args);
}

function splitWhenImplementation<T>(
  data: ReadonlyArray<T>,
  predicate: (item: T, index: number, data: ReadonlyArray<T>) => boolean,
): [Array<T>, Array<T>] {
  const index = data.findIndex(predicate);
  return index === -1
    ? [[...data], []]
    : [data.slice(0, index), data.slice(index)];
}
