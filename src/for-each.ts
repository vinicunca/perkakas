import type { IterableContainer } from './internal/types/iterable-container';
import type { LazyCallback } from './internal/types/lazy-callback';
import type { LazyEvaluator } from './internal/types/lazy-evaluator';
import { curryWithLazy } from './internal/curry-with-lazy';
import { requireDataByArity } from './internal/require-data';

/**
 * Executes a provided function once for each array element. Equivalent to
 * `Array.prototype.forEach`.
 *
 * The dataLast version returns the original array (instead of not returning
 * anything (`void`)) to allow using it in a pipe. The returned array is the
 * same reference as the input array, and not a shallow copy of it, except when
 * `pipe` evaluates it lazily together with a function that can end the
 * iteration early (e.g., `take`), which builds a new array.
 *
 * @param data - The values that would be iterated on.
 * @param callbackfn - A function to execute for each element in the array.
 * @signature
 *    forEach(data, callbackfn)
 * @example
 *    forEach([1, 2, 3], x => {
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
 * same reference as the input array, and not a shallow copy of it, except when
 * `pipe` evaluates it lazily together with a function that can end the
 * iteration early (e.g., `take`), which builds a new array. Either way it keeps
 * the input's type, `readonly` included.
 *
 * @param callbackfn - A function to execute for each element in the array.
 * @returns The original array (the ref itself, not a shallow copy of it).
 * @signature
 *    forEach(callbackfn)(data)
 * @example
 *    pipe(
 *      [1, 2, 3],
 *      forEach(x => {
 *        console.log(x)
 *      })
 *    ) // => [1, 2, 3]
 * @dataLast
 * @lazy
 * @category Array
 */
export function forEach<T extends IterableContainer>(
  callbackfn: LazyCallback<T, void>,
): (data: T) => T;

export function forEach(...args: ReadonlyArray<unknown>): unknown {
  return curryWithLazy(forEachImplementation, args, lazyImplementation);
}

function forEachImplementation<T>(
  data: ReadonlyArray<T>,
  callbackfn: (value: T, index: number, data: ReadonlyArray<T>) => void,
): ReadonlyArray<T> {
  data.forEach(callbackfn);
  return data;
}

function lazyImplementation<T>(callbackfn: (value: T, index: number, data: ReadonlyArray<T>) => void): LazyEvaluator<T> {
  return requireDataByArity(callbackfn, (value, index, data) => {
    callbackfn(value, index, data);
    return value;
  });
}
