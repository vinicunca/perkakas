import type { IterableContainer } from './_types';
import type { LazyEvaluator } from './pipe';

import { purry } from './purry';

type FirstOut<T extends IterableContainer> = T extends []
  ? undefined
  : T extends readonly [unknown, ...Array<unknown>]
    ? T[0]
    : T extends readonly [...infer Pre, infer Last]
      ? Last | Pre[0]
      : T[0] | undefined;

/**
 * Gets the first element of `array`.
 * Note: In `pipe`, use `first()` form instead of `first`. Otherwise, the inferred type is lost.
 * @param array the array
 * @signature
 *    first(array)
 * @example
 *    first([1, 2, 3]) // => 1
 *    first([]) // => undefined
 *    pipe(
 *      [1, 2, 4, 8, 16],
 *      filter(x => x > 3),
 *      first(),
 *      x => x + 1
 *    ); // => 5
 *
 * @category Array
 * @pipeable
 */
export function first<T extends IterableContainer>(
  array: Readonly<T>
): FirstOut<T>;
export function first<T extends IterableContainer>(): (
  array: Readonly<T>
) => FirstOut<T>;

export function first(...args: Array<any>): unknown {
  return purry(first_, args, first.lazy);
}

function first_<T>([item]: ReadonlyArray<T>): T | undefined {
  return item;
}

export namespace first {
  export function lazy<T>(): LazyEvaluator<T> {
    return (value) => ({ done: true, hasNext: true, next: value });
  }

  export namespace lazy {
    export const single = true;
  }
}
