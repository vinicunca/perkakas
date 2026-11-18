import { describe, expectTypeOf, it } from 'vitest';
import type { LazyUnaryFunction } from './lazy-data-last-implementation';
import { curryWithLazy } from './curry-with-lazy';
import type { LazyEvaluator } from './types/lazy-evaluator';

it('return type', () => {
  expectTypeOf(
    curryWithLazy(takeImplementation, 2, lazyImplementation, []),
  ).toEqualTypeOf<
    Array<number> | LazyUnaryFunction<ReadonlyArray<number>, [count: number], Array<number>>
  >();
});

describe('arity', () => {
  it('matches the data-first parameters', () => {
    curryWithLazy(
      takeImplementation,
      // @ts-expect-error [ts2345] -- `takeImplementation` takes 2 parameters, so 1 isn't its arity.
      1,
      lazyImplementation,
      [],
    );
    curryWithLazy(
      takeImplementation,
      // @ts-expect-error [ts2345] -- `takeImplementation` takes 2 parameters, so 3 isn't its arity.
      3,
      lazyImplementation,
      [],
    );
  });

  it('counts optional parameters', () => {
    curryWithLazy(
      takeOptionalImplementation,
      2,
      lazyOptionalImplementation,
      [],
    );
    curryWithLazy(
      takeOptionalImplementation,
      // @ts-expect-error [ts2345] -- The optional `count` still counts, so 1 isn't the arity.
      1,
      lazyOptionalImplementation,
      [],
    );
  });
});

const takeImplementation = (data: ReadonlyArray<number>, count: number): number[] =>
  data.slice(0, count);

const lazyImplementation = (_count: number): LazyEvaluator<number> =>
  passThrough;

const takeOptionalImplementation = (
  data: ReadonlyArray<number>,
  count?: number,
): number[] => data.slice(0, count);

const lazyOptionalImplementation = (_count?: number): LazyEvaluator<number> =>
  passThrough;

const passThrough: LazyEvaluator<number> = (value) => value;
