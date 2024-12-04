import type { Writable } from 'type-fest';

import type { IterableContainer } from './internal/types/iterable-container';
import type { LazyEvaluator } from './pipe';

import { curry } from './curry';

/**
 * Executes a provided function once for each array element. Equivalent to
 * `Array.prototype.forEach`.
 *
 * The dataLast version returns the original array (instead of not returning
 * anything (`void`)) to allow using it in a pipe. When not used in a `pipe` the
 * returned array is equal to the input array (by reference), and not a shallow
 * copy of it!
 *
 * @param data - The values that would be iterated on.
 * @param callbackfn - A function to execute for each element in the array.
 * @signature
 *    P.forEach(data, callbackfn)
 * @example
 *    P.forEach([1, 2, 3], x => {
 *      console.log(x)
 *    });
 * @dataFirst
 * @lazy
 * @category Array
 */
export function forEach<T extends IterableContainer>(
  data: T,
  callbackfn: (value: T[number], index: number, data: T) => void,
): void;

/**
 * Executes a provided function once for each array element. Equivalent to
 * `Array.prototype.forEach`.
 *
 * The dataLast version returns the original array (instead of not returning
 * anything (`void`)) to allow using it in a pipe. The returned array is the
 * same reference as the input array, and not a shallow copy of it!
 *
 * @param callbackfn - A function to execute for each element in the array.
 * @returns The original array (the ref itself, not a shallow copy of it).
 * @signature
 *    P.forEach(callbackfn)(data)
 * @example
 *    P.pipe(
 *      [1, 2, 3],
 *      P.forEach(x => {
 *        console.log(x)
 *      })
 *    ) // => [1, 2, 3]
 * @dataLast
 * @lazy
 * @category Array
 */
export function forEach<T extends IterableContainer>(
  callbackfn: (value: T[number], index: number, data: T) => void,
): (data: T) => Writable<T>;

export function forEach(...args: ReadonlyArray<unknown>): unknown {
  return curry(forEachImplementation, args, lazyImplementation);
}

function forEachImplementation<T>(
  data: ReadonlyArray<T>,
  callbackfn: (value: T, index: number, data: ReadonlyArray<T>) => void,
): Array<T> {
  data.forEach(callbackfn);
  // @ts-expect-error [ts4104] - Because the dataFirst signature returns void this is only a problem when the dataLast function is used **outside** of a pipe; for these cases we warn the user that this is happening.
  return data;
}

function lazyImplementation<T>(
  callbackfn: (value: T, index: number, data: ReadonlyArray<T>) => void,
): LazyEvaluator<T> {
  return (value, index, data) => {
    callbackfn(value, index, data);
    return { done: false, hasNext: true, next: value };
  };
}
