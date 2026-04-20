import type { LazyResult } from './types/lazy-result';

const EMPTY_PIPE = { done: true, hasNext: false } as const;

/**
 * A singleton value for skipping an item in a lazy evaluator.
 */
export const SKIP_ITEM = { done: false, hasNext: false } as const;

/**
 * A helper evaluator when we want to return an empty result. It memoizes both
 * the result and the evaluator itself to reduce memory usage.
 */
export const lazyEmptyEvaluator = <T>(): LazyResult<T> => EMPTY_PIPE;

/**
 * A helper evaluator when we want to return a shallow clone of the input. It
 * memoizes both the evaluator itself to reduce memory usage.
 */
// eslint-disable-next-line ts/explicit-function-return-type
export function lazyIdentityEvaluator<T>(value: T) {
  return ({
    hasNext: true,
    next: value,
    done: false,
  }) as const;
}
