/* eslint-disable ts/no-use-before-define */
import type { First } from './internal/types/first';
import type { IterableContainer } from './internal/types/iterable-container';
import type { LazyEvaluator } from './internal/types/lazy-evaluator';
import { curry } from './curry';
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
  return curry(firstImplementation, args, toSingle(lazyImplementation));
}

const firstImplementation = <T>([item]: ReadonlyArray<T>): T | undefined => item;

const lazyImplementation = (): LazyEvaluator => firstLazy;

// eslint-disable-next-line ts/explicit-function-return-type
function firstLazy<T>(value: T) {
  return ({ hasNext: true, next: value, done: true }) as const;
}
