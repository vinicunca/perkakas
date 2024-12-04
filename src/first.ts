import type { IterableContainer } from './internal/types/iterable-container';
import type { LazyEvaluator } from './pipe';
import { curry } from './curry';
import { toSingle } from './internal/to-single';

type First<T extends IterableContainer> = T extends []
  ? undefined
  : T extends readonly [unknown, ...Array<unknown>]
    ? T[0]
    : T extends readonly [...infer Pre, infer Last]
      ? Last | Pre[0]
      : T[0] | undefined;

/**
 * Gets the first element of `array`.
 *
 * @param data - The array.
 * @returns The first element of the array.
 * @signature
 *    P.first(array)
 * @example
 *    P.first([1, 2, 3]) // => 1
 *    P.first([]) // => undefined
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
 *    P.first()(array)
 * @example
 *    P.pipe(
 *      [1, 2, 4, 8, 16],
 *      P.filter(x => x > 3),
 *      P.first(),
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

function firstImplementation<T>([item]: ReadonlyArray<T>): T | undefined {
  return item;
}

function lazyImplementation(): LazyEvaluator {
  return firstLazy;
}

// eslint-disable-next-line ts/explicit-function-return-type
function firstLazy<T>(value: T) {
  return ({ hasNext: true, next: value, done: true }) as const;
}
