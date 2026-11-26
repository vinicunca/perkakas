import type { LazyEvaluator } from './internal/lazy-evaluator';
import type { ArrayCallback, LazyCallback } from './internal/types/callback';
import type { DataLastBuilder } from './internal/types/data-last-builder';
import type { IterableContainer } from './internal/types/iterable-container';
import type { Mapped } from './internal/types/mapped';
import { withLazyImplementation } from './internal/lazy-data-last-implementation';
import { canReadData, requireData } from './internal/require-data';

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
 *    map(data, callbackfn)
 * @example
 *    map([1, 2, 3], multiply(2)); // => [2, 4, 6]
 *    map([0, 0], add(1)); // => [1, 1]
 *    map([0, 0], (value, index) => value + index); // => [0, 1]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function map<T extends IterableContainer, U>(
  data: T,
  callbackfn: ArrayCallback<T, U>,
): Mapped<T, U>;

/**
 * Creates a new array populated with the results of calling a provided function
 * on every element in the calling array. Equivalent to `Array.prototype.map`.
 *
 * @param callbackfn - A function to execute for each element in the array. Its
 * return value is added as a single element in the new array. Inside a `pipe`,
 * its `data` argument might hold only the items processed so far; see `pipe`.
 * @returns A new array with each element being the result of the callback
 * function.
 * @signature
 *    map(callbackfn)(data)
 * @example
 *    pipe([1, 2, 3], map(multiply(2))); // => [2, 4, 6]
 *    pipe([0, 0], map(add(1))); // => [1, 1]
 *    pipe([0, 0], map((value, index) => value + index)); // => [0, 1]
 * @dataLast
 * @lazy
 * @category Array
 */
export function map<T extends IterableContainer, U>(
  callbackfn: LazyCallback<T, U>,
): (data: T) => Mapped<T, U>;

export function map(
  dataOrCallbackfn: IterableContainer | LazyCallback<IterableContainer>,
  callbackfn?: ArrayCallback,
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
    : mapImplementation(
        dataOrCallbackfn,
        // @ts-expect-error [ts2345] -- `typeof` narrows only the first parameter; the data-first overloads guarantee the rest.
        callbackfn,
      );
}

const dataLast: DataLastBuilder<typeof mapImplementation>
  = (callbackfn) => (data) =>
    mapImplementation(data, callbackfn);

function mapImplementation<T, U>(data: ReadonlyArray<T>, callbackfn: (value: T, index: number, data: ReadonlyArray<T>) => U): Array<U> {
  return data.map(callbackfn);
}

function lazyImplementation<T, U>(callbackfn: (value: T, index: number, data: ReadonlyArray<T>) => U): LazyEvaluator<T, U> {
  return canReadData(callbackfn, 2)
    ? requireData((value, index, data) => callbackfn(value, index, data))
    : // A callback that doesn't read `data` already is a complete evaluator,
  // and using it directly saves a call per item. It also receives `slot`
  // as a 4th argument, which only a callback slipping through
  // `canReadData`'s gaps can see.
    callbackfn;
}
