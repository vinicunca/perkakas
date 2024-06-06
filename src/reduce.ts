import { curry } from './curry';

/**
 * Executes a user-supplied "reducer" callback function on each element of the
 * array, in order, passing in the return value from the calculation on the
 * preceding element. The final result of running the reducer across all
 * elements of the array is a single value. Equivalent to
 * `Array.prototype.reduce`.
 *
 * @param data - The items to reduce.
 * @param callbackfn - A function to execute for each element in the array. Its
 * return value becomes the value of the accumulator parameter on the next
 * invocation of callbackFn. For the last invocation, the return value becomes
 * the return value of reduce().
 * @param initialValue - A value to which accumulator is initialized the first
 * time the callback is called. CallbackFn starts executing with the first value
 * in the array as currentValue.
 * @returns The value that results from running the "reducer" callback function
 * to completion over the entire array.
 * @signature
 *    P.reduce(data, callbackfn, initialValue)
 * @example
 *    P.reduce([1, 2, 3, 4, 5], (acc, x) => acc + x, 100) // => 115
 * @dataFirst
 * @category Array
 */
export function reduce<T, U>(
  data: ReadonlyArray<T>,
  callbackfn: (
    previousValue: U,
    currentValue: T,
    currentIndex: number,
    data: ReadonlyArray<T>,
  ) => U,
  initialValue: U,
): U;

/**
 * Executes a user-supplied "reducer" callback function on each element of the
 * array, in order, passing in the return value from the calculation on the
 * preceding element. The final result of running the reducer across all
 * elements of the array is a single value. Equivalent to
 * `Array.prototype.reduce`.
 *
 * @param callbackfn - A function to execute for each element in the array. Its
 * return value becomes the value of the accumulator parameter on the next
 * invocation of callbackFn. For the last invocation, the return value becomes
 * the return value of reduce().
 * @param initialValue - A value to which accumulator is initialized the first
 * time the callback is called. CallbackFn starts executing with the first value
 * in the array as currentValue.
 * @returns The value that results from running the "reducer" callback function
 * to completion over the entire array.
 * @signature
 *    P.reduce(fn, initialValue)(array)
 * @example
 *    P.pipe([1, 2, 3, 4, 5], P.reduce((acc, x) => acc + x, 100)) // => 115
 * @dataLast
 * @category Array
 */
export function reduce<T, U>(
  callbackfn: (
    previousValue: U,
    currentValue: T,
    currentIndex: number,
    data: ReadonlyArray<T>,
  ) => U,
  initialValue: U,
): (data: ReadonlyArray<T>) => U;

export function reduce(...args: ReadonlyArray<unknown>): unknown {
  return curry(reduceImplementation, args);
}

function reduceImplementation<T, U>(
  data: ReadonlyArray<T>,
  callbackfn: (
    previousValue: U,
    currentValue: T,
    currentIndex: number,
    data: ReadonlyArray<T>,
  ) => U,
  initialValue: U,
): U {
  return data.reduce(callbackfn, initialValue);
}
