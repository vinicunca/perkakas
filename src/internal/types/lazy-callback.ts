import type { IterableContainer } from './iterable-container';
import type { NonEmptyPrefix } from './non-empty-prefix';

/**
 * Helper type for lazy callbacks.
 *
 * @see NonEmptyPrefix
 */
export type LazyCallback<T extends IterableContainer, R> = (
  value: T[number],
  index: number,
  data: Readonly<NonEmptyPrefix<T>>,
) => R;

/**
 * Helper type for lazy type predicates (because TypeScript doesn't support a
 * syntax like `LazyCallback<T, is S>`).
 *
 * @see NonEmptyPrefix
 */
export type LazyTypePredicate<T extends IterableContainer, S> = (
  value: T[number],
  index: number,
  data: Readonly<NonEmptyPrefix<T>>,
) => value is S;
