import type { LazyEvaluator } from './types/lazy-evaluator';
import type { StrictFunction } from './types/strict-function';

// Most callbacks have the input `data` as their 3rd parameter, as in the
// standard library's array iteration methods (`map`, `filter`, `find`, ...).
const DEFAULT_DATA_PARAMETER_INDEX = 2;

interface RequireDataByArityOptions {
  /**
   * Callbacks with an extra parameter before the index have `data` one
   * position later: an accumulator (`mapWithFeedback`) or the second input's
   * item (`zipWith`).
   *
   * @see zipWith
   * @default 2
   */
  readonly dataParameterIndex?: number;
}

/**
 * Marks an evaluator that always needs `data`, because it reads it itself or
 * forwards it to a callback known to read it, so `pipe` must always buffer.
 * The marker is applied by mutating `evaluator`, so callers must pass a freshly
 * created closure, never a shared singleton or the user's callback itself.
 */
export function requireData<T, R>(evaluator: NoInfer<LazyEvaluator<T, R>>): LazyEvaluator<T, R> {
  // @ts-expect-error [ts2540] -- Intentional! we want to keep the prop
  // `readonly` to communicate that it shouldn't be mutated freely; this is the
  // only place where we allow it to be set!
  evaluator.requiresData = true;
  return evaluator;
}

/**
 * Marks an evaluator as needing `data` only when the user's `callback` is
 * likely to read it, based on its signature. It marks `evaluator` the way
 * `requireData` does, by mutating it, so callers must pass a freshly created
 * closure, never a module-level evaluator such as `lazyEmptyEvaluator`.
 *
 * @see canReadData
 * @see requireData
 */
export function requireDataByArity<T, R>(callback: StrictFunction, evaluator: NoInfer<LazyEvaluator<T, R>>, {
  dataParameterIndex = DEFAULT_DATA_PARAMETER_INDEX,
}: RequireDataByArityOptions = {}): LazyEvaluator<T, R> {
  return canReadData(callback, dataParameterIndex)
    ? requireData(evaluator)
    : evaluator;
}

/**
 * Whether the user's `callback` is likely to read its `data` parameter, based
 * on its signature.
 *
 * Whenever our detection fails we provide the function with the sentinel
 * pseudo-array `UNEXPECTED_ACCESS_SENTINEL` which throws on almost any kind of
 * usage to signal as soon as possible that something went wrong.
 */
export function canReadData({ length }: StrictFunction, dataParameterIndex = DEFAULT_DATA_PARAMETER_INDEX): boolean {
  return length === 0
  // For all other functions we assume that if the function *itself* declares a
  // parameter at the data parameter index, then it most likely wants to handle
  // it and we should provide it.
  // This does have its drawbacks due to the same issues mentioned above, if
  // the function uses default params, uses a rest element, or accesses the
  // data via the `arguments` keyword.
    || length > dataParameterIndex;
}
