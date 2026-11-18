import type { StoppableLazyEvaluator } from '../src/internal/make-stoppable';
import type { IterableContainer } from '../src/internal/types/iterable-container';
import { lazyDataLastImplementation } from '../src/internal/lazy-data-last-implementation';
import {
  makeStoppable,

} from '../src/internal/make-stoppable';

/**
 * A `pipe` step that makes the run of lazy functions it's part of evaluate
 * lazily, item by item, even on an array. `pipe` fuses a run only when one of
 * its functions can end the iteration early; this step is marked as one that
 * can, but passes every item through, so the rest of the run sees them all.
 *
 * When the run doesn't fuse (the step is alone, or `pipe` no longer fuses it),
 * the step throws, so a test that relies on it can't quietly pass on the
 * data-first implementations instead.
 */
export function forceFusion<T extends IterableContainer>(): ((
  data: T,
) => Array<T[number]>) {
  // eslint-disable-next-line ts/no-use-before-define -- `lazyImplementation` is only read when the evaluator is built, after the module has loaded.
  return lazyDataLastImplementation(throwNotFused, [], lazyImplementation);
}

function throwNotFused(): never {
  throw new Error('forceFusion: the run wasn\'t evaluated lazily');
}

const passThrough: StoppableLazyEvaluator = (value) => value;

const lazyImplementation = makeStoppable(
  (): StoppableLazyEvaluator => passThrough,
);
