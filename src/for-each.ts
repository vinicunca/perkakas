import type { LazyEvaluator } from './internal/lazy-evaluator';
import type { ArrayCallback, LazyCallback } from './internal/types/callback';
import type { DataLastBuilder } from './internal/types/data-last-builder';
import type { IterableContainer } from './internal/types/iterable-container';
import { withLazyImplementation } from './internal/lazy-data-last-implementation';
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
  callbackfn: ArrayCallback<T, void>,
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

export function forEach(
  dataOrCallbackfn: IterableContainer | LazyCallback<IterableContainer, void>,
  callbackfn?: ArrayCallback<IterableContainer, void>,
): unknown {
  return typeof dataOrCallbackfn === 'function'
    ? withLazyImplementation(
        // eslint-disable-next-line ts/no-use-before-define -- implementations follow the overloaded signatures
        dataLast(
          // @ts-expect-error [ts2345] -- Run eagerly, the data-last function hands the callback the complete input, a valid non-empty prefix whenever the callback is invoked (it never is for an empty input); TypeScript can't relate `T` to `NonEmptyPrefix<T>`.
          dataOrCallbackfn,
        ),
        lazyImplementation,
        // @ts-expect-error [ts2345] -- `lazyImplementation` invokes the callback only once the input has an item, so the prefix it passes is never empty; TypeScript can't tell from its `readonly T[]` type.
        dataOrCallbackfn,
      )
    : forEachImplementation(
        dataOrCallbackfn,
        // @ts-expect-error [ts2345] -- `typeof` narrows only the first parameter; the data-first overloads guarantee the rest.
        callbackfn,
      );
}

const dataLast: DataLastBuilder<typeof forEachImplementation>
  = (callbackfn) => (data) =>
    forEachImplementation(data, callbackfn);

function forEachImplementation<T>(
  data: ReadonlyArray<T>,
  callbackfn: (value: T, index: number, data: ReadonlyArray<T>) => void,
): ReadonlyArray<T> {
  data.forEach(callbackfn);
  return data;
}

function lazyImplementation<T>(callbackfn: (value: T, index: number, data: ReadonlyArray<T>) => void): LazyEvaluator<T> {
  return requireDataByArity(callbackfn, 2, (value, index, data) => {
    callbackfn(value, index, data);
    return value;
  });
}
