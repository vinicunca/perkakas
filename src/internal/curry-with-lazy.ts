import type { DataFirst } from './data-last-implementation';
import type { LazyDefinition, LazyUnaryFunction } from './lazy-data-last-implementation';
import type { IterableContainer } from './types/iterable-container';
import {
  lazyDataLastImplementation,

} from './lazy-data-last-implementation';

/**
 * An internal-only re-implementation of `curry` that allows passing a lazy
 * function to the `lazyDataLastImplementation`.
 *
 * This is done as a copy instead of having `curry` call it to keep the
 * execution stack and the bundle lean for the vast majority of functions that
 * don't have lazy semantics.
 */
export function curryWithLazy<
  T extends IterableContainer,
  P extends ReadonlyArray<unknown>,
  R,
>(dataFirst: DataFirst<T, P, R>, args: ReadonlyArray<unknown>, lazy: LazyDefinition<T, P>['lazy']): R | LazyUnaryFunction<T, P, R> {
  return args.length >= dataFirst.length
    ? dataFirst(
        // @ts-expect-error [ts2556] -- the whole point of currying is that `args` are polymorphic and can either fit the data-first pattern, like here, or the data-last pattern as below. The length check that is used to pick between them can't narrow it!
        ...args,
      )
    : lazyDataLastImplementation(
        dataFirst,
        // @ts-expect-error [ts2345] -- the whole point of currying is that `args` are polymorphic and can either fit the data-first pattern, as above, or the data-last pattern, like here. The length check that is used to pick between them can't narrow it!
        args,
        lazy,
      );
}
