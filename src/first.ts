import type { LazyResult, LazySlot } from './internal/lazy-control';
import type { First } from './internal/types/first';
import type { IterableContainer } from './internal/types/iterable-container';
import { curryWithLazy } from './internal/curry-with-lazy';
import {
  lastLazyValue,

} from './internal/lazy-control';
import { toSingle } from './internal/to-single';

/**
 * Gets the first element of `array`.
 *
 * @param data - The array.
 * @returns The first element of the array.
 * @signature
 *    first(array)
 * @example
 *    first([1, 2, 3]) // => 1
 *    first([]) // => undefined
 * @dataFirst
 * @lazy
 * @category Array
 */
export function first<T extends IterableContainer>(data: T): First<T>;

/**
 * Gets the first element of `array`.
 *
 * @returns The first element of the array.
 * @signature
 *    first()(array)
 * @example
 *    pipe(
 *      [1, 2, 4, 8, 16],
 *      filter(x => x > 3),
 *      first(),
 *      x => x + 1
 *    ); // => 5
 * @dataLast
 * @lazy
 * @category Array
 */
export function first(): <T extends IterableContainer>(data: T) => First<T>;

export function first(...args: ReadonlyArray<unknown>): unknown {
  // eslint-disable-next-line ts/no-use-before-define -- implementations follow the overloaded signatures
  return curryWithLazy(firstImplementation, args, lazyImplementation);
}

function firstImplementation<T>([item]: ReadonlyArray<T>): T | undefined {
  return item;
}

const lazyImplementation = toSingle(() => emitAndStop);

function emitAndStop<T>(value: T, _index: number, _data: ReadonlyArray<T>, slot: LazySlot): LazyResult<T> {
  return lastLazyValue(value, slot);
}
