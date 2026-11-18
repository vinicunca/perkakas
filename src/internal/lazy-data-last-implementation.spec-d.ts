import type { LazyEvaluator } from './lazy-evaluator';
import { describe, it } from 'vitest';
import { withLazyImplementation } from './lazy-data-last-implementation';

declare const dataLast: (data: ReadonlyArray<number>) => Array<number>;

declare function callback(value: number): number;

declare function isEqual(a: number, b: number): boolean;

declare function lazyOfCallback(
  callbackfn: (value: number) => number,
): LazyEvaluator<number>;

declare function lazyOfTuple(
  lazyArgument: readonly [
    other: ReadonlyArray<number>,
    isEqual: (a: number, b: number) => boolean,
  ],
): LazyEvaluator<number>;

declare function lazyOfTwoParameters(
  other: ReadonlyArray<number>,
  isEqual: (a: number, b: number) => boolean,
): LazyEvaluator<number>;

describe('lazy argument', () => {
  it('a single argument as is', () => {
    withLazyImplementation(dataLast, lazyOfCallback, callback);
  });

  it('two arguments as a tuple', () => {
    withLazyImplementation(dataLast, lazyOfTuple, [
      [1],
      isEqual,
    ]);
  });

  it('rejects a single argument in a tuple', () => {
    withLazyImplementation(
      dataLast,
      lazyOfCallback,
      // @ts-expect-error [ts2345] -- A lazy implementation receives a single argument as is, not in a tuple.
      [callback],
    );
  });

  it('rejects one argument where the implementation takes a tuple', () => {
    withLazyImplementation(
      dataLast,
      lazyOfTuple,
      // @ts-expect-error [ts2322] -- The lazy implementation reads `[other, isEqual]`, not `other` alone.
      [1],
    );
  });

  it('rejects a lazy implementation spreading two arguments', () => {
    withLazyImplementation(
      dataLast,
      // @ts-expect-error [ts2345] -- A lazy implementation receives two arguments as one tuple, not spread.
      lazyOfTwoParameters,
      [
        [1],
        isEqual,
      ],
    );
  });
});
