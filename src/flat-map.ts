import type { LazyResult } from './internal/lazy-control';
import type { LazyEvaluator } from './internal/lazy-evaluator';
import type { ArrayCallback, LazyCallback } from './internal/types/callback';
import type { DataLastBuilder } from './internal/types/data-last-builder';
import { manyLazyValues } from './internal/lazy-control';
import { withLazyImplementation } from './internal/lazy-data-last-implementation';
import { requireDataByArity } from './internal/require-data';

/**
 * Returns a new array formed by applying a given callback function to each
 * element of the array, and then flattening the result by one level. It is
 * identical to a `map` followed by a `flat` of depth 1
 * (`flat(map(data, ...args))`), but slightly more efficient than calling those
 * two methods separately. Equivalent to `Array.prototype.flatMap`.
 *
 * @param data - The items to map and flatten.
 * @param callbackfn - A function to execute for each element in the array. It
 * should return an array containing new elements of the new array, or a single
 * non-array value to be added to the new array.
 * @returns A new array with each element being the result of the callback
 * function and flattened by a depth of 1.
 * @signature
 *    flatMap(data, callbackfn)
 * @example
 *    flatMap([1, 2, 3], x => [x, x * 10]) // => [1, 10, 2, 20, 3, 30]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function flatMap<T, U>(
  data: ReadonlyArray<T>,
  callbackfn: ArrayCallback<ReadonlyArray<T>, ReadonlyArray<U> | U>,
): Array<U>;

/**
 * Returns a new array formed by applying a given callback function to each
 * element of the array, and then flattening the result by one level. It is
 * identical to a `map` followed by a `flat` of depth 1
 * (`flat(map(data, ...args))`), but slightly more efficient than calling those
 * two methods separately. Equivalent to `Array.prototype.flatMap`.
 *
 * @param callbackfn - A function to execute for each element in the array. It
 * should return an array containing new elements of the new array, or a single
 * non-array value to be added to the new array.
 * @returns A new array with each element being the result of the callback
 * function and flattened by a depth of 1.
 * @signature
 *    flatMap(callbackfn)(data)
 * @example
 *    pipe([1, 2, 3], flatMap(x => [x, x * 10])) // => [1, 10, 2, 20, 3, 30]
 * @dataLast
 * @lazy
 * @category Array
 */
export function flatMap<T, U>(
  callbackfn: LazyCallback<ReadonlyArray<T>, ReadonlyArray<U> | U>,
): (data: ReadonlyArray<T>) => Array<U>;

export function flatMap(
  dataOrCallbackfn: ReadonlyArray<unknown> | LazyCallback<ReadonlyArray<unknown>>,
  callbackfn?: ArrayCallback<ReadonlyArray<unknown>>,
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
    : flatMapImplementation(
        dataOrCallbackfn,
        // @ts-expect-error [ts2345] -- `typeof` narrows only the first parameter; the data-first overloads guarantee the rest.
        callbackfn,
      );
}

const dataLast: DataLastBuilder<typeof flatMapImplementation>
  = (callbackfn) => (data) =>
    flatMapImplementation(data, callbackfn);

function flatMapImplementation<T, U>(data: ReadonlyArray<T>, callbackfn: (value: T, index: number, data: ReadonlyArray<T>) => ReadonlyArray<U> | U): Array<U> {
  return data.flatMap(callbackfn);
}

function lazyImplementation<T, K>(callbackfn: (input: T, index: number, data: ReadonlyArray<T>) => K | ReadonlyArray<K>): LazyEvaluator<T, K> {
  return requireDataByArity(callbackfn, 2, (value, index, data, slot): LazyResult<K> => {
    const mapped = callbackfn(value, index, data);
    return Array.isArray(mapped)
      ? manyLazyValues(mapped, slot)
      : // @ts-expect-error [ts2322] -- Array.isArray doesn't narrow readonly
    // arrays (https://github.com/microsoft/TypeScript/issues/17002), so
    // `mapped` is still typed as K | readonly K[] here even though it is
    // never an array at runtime.
      mapped;
  });
}
