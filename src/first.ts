import type { StoppableLazyEvaluator } from './internal/make-stoppable';
import type { First } from './internal/types/first';
import type { IterableContainer } from './internal/types/iterable-container';
import { curryWithLazy } from './internal/curry-with-lazy';
import { makeReducing } from './internal/make-reducing';
import {
  lastLazyValue,
  makeStoppable,
} from './internal/make-stoppable';

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
  return curryWithLazy(firstImplementation, 1, lazyImplementation, args);
}

function firstImplementation<T>([item]: ReadonlyArray<T>): T | undefined {
  return item;
}

// eslint-disable-next-line ts/no-use-before-define -- `emitAndStop` is only read when the evaluator is built, after the module has loaded.
const lazyImplementation = makeReducing(makeStoppable(() => emitAndStop));

const emitAndStop: StoppableLazyEvaluator = (value, _index, _data, slot) =>
  lastLazyValue(value, slot);
