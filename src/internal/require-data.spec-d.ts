import { describe, it } from 'vitest';
import {
  lastLazyValue,
  STOP,
  type StoppableLazyEvaluator,
} from './make-stoppable';
import { requireData, requireDataByArity } from './require-data';
import type { LazyEvaluator } from './types/lazy-evaluator';

// Both stand in for the evaluator type a lazy implementation declares as its
// return type, which is what checks the evaluator it returns.
declare function numberEvaluator(evaluator: LazyEvaluator<number>): void;
declare function stoppableNumberEvaluator(
  evaluator: StoppableLazyEvaluator<number>,
): void;

// Stands in for the user's callback, whose arity `requireDataByArity` reads.
declare function callback(
  value: number,
  index: number,
  data: ReadonlyArray<number>,
): boolean;

describe('accepted', () => {
  it('an evaluator that can stop', () => {
    stoppableNumberEvaluator(
      requireData((value, _index, _data, slot) => lastLazyValue(value, slot)),
    );
  });

  it('an evaluator that can stop, by arity', () => {
    stoppableNumberEvaluator(
      requireDataByArity(callback, (value, _index, _data, slot) =>
        lastLazyValue(value, slot),
      ),
    );
  });
});

describe('rejected', () => {
  it('an evaluator returning another type', () => {
    numberEvaluator(
      requireData(
        () =>
          // @ts-expect-error [ts2322] -- The evaluator returns a string where
          // the declared evaluator type expects a number.
          'x',
      ),
    );
  });

  it('stop from an evaluator that can\'t stop', () => {
    numberEvaluator(
      requireData(
        () =>
          // @ts-expect-error [ts2322] -- `requireData` returns the declared
          // evaluator type unchanged, and that type can't stop.
          STOP,
      ),
    );
  });

  it('stop from an evaluator that can\'t stop, by arity', () => {
    numberEvaluator(
      requireDataByArity(
        callback,
        () =>
          // @ts-expect-error [ts2322] -- `requireDataByArity` returns the
          // declared evaluator type unchanged, and that type can't stop.
          STOP,
      ),
    );
  });
});
