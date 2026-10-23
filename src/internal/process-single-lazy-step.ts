/* eslint-disable sonarjs/no-all-duplicated-branches */
/* eslint-disable sonarjs/no-duplicated-branches */
import type { LazySlot } from './lazy-control';
import type { LazyDefinition } from './lazy-data-last-implementation';
import {
  createLazySlot,
  LAST,

  MANY,
  SKIP_ITEM,
  STOP,
} from './lazy-control';
import { UNEXPECTED_ACCESS_SENTINEL } from './unexpected-access-sentinel';

/**
 * Runs an iterable through a single lazy step, skipping the step objects and
 * the fan-out recursion that the general path in `pipe` needs.
 *
 * @param input - The data to run through the step.
 * @param lazy - The lazy implementation the step's evaluator is built from.
 * @param lazyArgs - The arguments the evaluator is built with.
 * @see pipe
 */
export function processSingleLazyStep<P extends ReadonlyArray<unknown>>(
  input: Iterable<unknown>,
  lazy: LazyDefinition<ReadonlyArray<unknown>, P>['lazy'],
  lazyArgs: LazyDefinition<ReadonlyArray<unknown>, P>['lazyArgs'],
): unknown {
  const lazyEvaluator = lazy(...lazyArgs);

  // `dataBuffer` exists only when the evaluator requires `data`, so it doubles
  // as the flag for filling it.
  const dataBuffer = lazyEvaluator.requiresData
    ? ([] as Array<unknown>)
    : undefined;
  const items = dataBuffer ?? UNEXPECTED_ACCESS_SENTINEL;

  const slot = createLazySlot();
  const accumulator: Array<unknown> = [];
  let index = 0;

  if (Array.isArray(input)) {
    // Iterated rather than indexed, so a reactive array that instruments
    // iteration tracks one dependency instead of one per index.
    for (const value of input) {
      dataBuffer?.push(value);

      const isDone = collect(
        lazyEvaluator(value, index, items, slot),
        accumulator,
        slot,
      );
      index += 1;
      if (isDone) {
        break;
      }
    }
  } else {
    for (const value of input) {
      dataBuffer?.push(value);

      const isDone = collect(
        lazyEvaluator(value, index, items, slot),
        accumulator,
        slot,
      );
      index += 1;
      if (isDone) {
        break;
      }
    }
  }

  return lazy.single ? accumulator[0] : accumulator;
}

/**
 * Adds whatever the evaluator emitted for one item to `accumulator`.
 *
 * @returns Whether the evaluator is done.
 */
function collect(
  result: unknown,

  accumulator: Array<unknown>,
  slot: LazySlot,
): boolean {
  // Every control is a symbol, so an item of any other type skips the
  // comparisons below with this one check.
  if (typeof result === 'symbol') {
    if (result === SKIP_ITEM) {
      return false;
    }

    if (result === MANY) {
      for (const subItem of slot.values) {
        // Pushed one by one rather than spread, so a large fan-out can't hit
        // the argument-count limit.
        accumulator.push(subItem);
      }
      return false;
    }

    if (result === LAST) {
      accumulator.push(slot.value);
      return true;
    }

    if (result === STOP) {
      return true;
    }
  }

  // The common case: the evaluator emitted an item.
  accumulator.push(result);
  return false;
}
