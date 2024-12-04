import type { IterableContainer } from './internal/types/iterable-container';
import type { Mapped } from './internal/types/mapped';
import type { LazyEvaluator } from './pipe';

import { curry } from './curry';

/**
 * Creates a new array populated with the results of calling a provided function
 * on every element in the calling array. Equivalent to `Array.prototype.map`.
 *
 * @param data - The array to map.
 * @param callbackfn - A function to execute for each element in the array. Its
 * return value is added as a single element in the new array.
 * @returns A new array with each element being the result of the callback
 * function.
 * @signature
 *    P.map(data, callbackfn)
 * @example
 *    P.map([1, 2, 3], P.multiply(2)); // => [2, 4, 6]
 *    P.map([0, 0], P.add(1)); // => [1, 1]
 *    P.map([0, 0], (value, index) => value + index); // => [0, 1]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function map<T extends IterableContainer, U>(
  data: T,
  callbackfn: (value: T[number], index: number, data: T) => U,
): Mapped<T, U>;

/**
 * Creates a new array populated with the results of calling a provided function
 * on every element in the calling array. Equivalent to `Array.prototype.map`.
 *
 * @param callbackfn - A function to execute for each element in the array. Its
 * return value is added as a single element in the new array.
 * @returns A new array with each element being the result of the callback
 * function.
 * @signature
 *    P.map(callbackfn)(data)
 * @example
 *    P.pipe([1, 2, 3], P.map(P.multiply(2))); // => [2, 4, 6]
 *    P.pipe([0, 0], P.map(P.add(1))); // => [1, 1]
 *    P.pipe([0, 0], P.map((value, index) => value + index)); // => [0, 1]
 * @dataLast
 * @lazy
 * @category Array
 */
export function map<T extends IterableContainer, U>(
  callbackfn: (value: T[number], index: number, data: T) => U,
): (data: T) => Mapped<T, U>;

export function map(...args: ReadonlyArray<unknown>): unknown {
  return curry(mapImplementation, args, lazyImplementation);
}

function mapImplementation<T, U>(
  data: ReadonlyArray<T>,
  callbackfn: (value: T, index: number, data: ReadonlyArray<T>) => U,
): Array<U> {
  return data.map(callbackfn);
};

function lazyImplementation<T, U>(
  callbackfn: (value: T, index: number, data: ReadonlyArray<T>) => U,
): LazyEvaluator<T, U> {
  return (value, index, data) => ({
    done: false,
    hasNext: true,
    next: callbackfn(value, index, data),
  });
}
