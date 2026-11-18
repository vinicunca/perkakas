import type { LazyUnaryFunction } from './lazy-data-last-implementation';
import type { LazyEvaluator } from './lazy-evaluator';
import type { IterableContainer } from './types/iterable-container';
import { describe, expectTypeOf, it } from 'vitest';
import {
  curryWithLazy1,
  curryWithLazy2,
  curryWithLazy3,
} from './curry-with-lazy-by-arity';

declare function takeImplementation(
  data: ReadonlyArray<number>,
  count: number,
): Array<number>;

declare function firstImplementation(
  data: ReadonlyArray<number>,
): number | undefined;

declare function firstLazyImplementation(): LazyEvaluator<number>;

declare function lazyImplementation(_count: number): LazyEvaluator<number>;

declare const passThrough: LazyEvaluator<number>;

declare function genericTakeImplementation<T extends IterableContainer>(
  data: T,
  count: number,
): Array<T[number]>;

declare function genericLazyImplementation<T>(count: number): LazyEvaluator<T>;

declare function differenceWithImplementation<T, Other>(
  data: ReadonlyArray<T>,
  other: ReadonlyArray<Other>,
  isEqual: (a: T, b: Other) => boolean,
): Array<T>;

declare function intersectionWithImplementation(
  data: ReadonlyArray<number>,
  other: ReadonlyArray<number>,
  isEqual: (a: number, b: number) => boolean,
): Array<number>;

declare function lazyImplementationOfOther<T>(
  other: ReadonlyArray<unknown>,
): LazyEvaluator<T>;

it('return type', () => {
  expectTypeOf(
    curryWithLazy2(
      takeImplementation,
      lazyImplementation,
      2 /* argumentsLength */,
      [1],
      1,
    ),
  ).toEqualTypeOf<
    Array<number> | LazyUnaryFunction<ReadonlyArray<number>, [count: number], Array<number>>
  >();
});

describe('arity', () => {
  it('matches the data-first parameters', () => {
    curryWithLazy1(
      // @ts-expect-error [ts2345] -- `takeImplementation` takes 2 parameters, so `curryWithLazy1` doesn't fit it.
      takeImplementation,
      lazyImplementation,
      1 /* argumentsLength */,
      [1],
    );
  });

  it('a single argument reaches the lazy implementation as is', () => {
    curryWithLazy2(
      takeImplementation,
      (_count: number) => passThrough,
      2 /* argumentsLength */,
      [1],
      1,
    );
  });

  it('rejects a lazy implementation taking a single argument in a tuple', () => {
    curryWithLazy2(
      takeImplementation,
      // @ts-expect-error [ts2345] -- A lazy implementation receives a single argument as is, not in a tuple.
      (_lazyArgument: readonly [count: number]) => passThrough,
      2 /* argumentsLength */,
      [1],
      1,
    );
  });

  it('two arguments reach the lazy implementation as one tuple', () => {
    curryWithLazy3(
      intersectionWithImplementation,
      (
        _lazyArgument: readonly [
          other: ReadonlyArray<number>,
          isEqual: (a: number, b: number) => boolean,
        ],
      ) => passThrough,
      3 /* argumentsLength */,
      [1],
      [1],
      () => true,
    );
  });

  it('rejects a lazy implementation taking two arguments spread', () => {
    curryWithLazy3(
      intersectionWithImplementation,
      // @ts-expect-error [ts2345] -- A lazy implementation receives two arguments as one tuple, not spread.
      (
        _other: ReadonlyArray<number>,
        _isEqual: (a: number, b: number) => boolean,
      ) => passThrough,
      3 /* argumentsLength */,
      [1],
      [1],
      () => true,
    );
  });
});

describe('generic implementation', () => {
  it('infers its parameters', () => {
    curryWithLazy2(
      genericTakeImplementation,
      genericLazyImplementation,
      2 /* argumentsLength */,
      [1],
      1,
    );
  });

  it('matches the lazy implementation to it', () => {
    curryWithLazy2(
      // @ts-expect-error [ts2345] -- `P` is inferred from the lazy implementation's `string` parameter, which the implementation's `count` rejects.
      genericTakeImplementation,
      (_count: string) => passThrough,
      2 /* argumentsLength */,
      [1],
      1,
    );
  });
});

describe('known issues!', () => {
  it('a lazy implementation that takes the tuple as its first argument', () => {
    // Expected: the call is rejected, since the lazy implementation receives
    // the tuple `[other, isEqual]` rather than `other`.
    //
    // Actual: it compiles, because the tuple is assignable to an array
    // parameter. In `pipe`, the lazy implementation then reads the tuple as
    // `other`.
    curryWithLazy3(
      differenceWithImplementation,
      lazyImplementationOfOther,
      3 /* argumentsLength */,
      [1],
      [1],
      () => true,
    );
  });

  it('an implementation with fewer parameters than the helper', () => {
    // Expected: the call is rejected, like `curryWithLazy1(takeImplementation)`
    // is (see "matches the data-first parameters").
    //
    // Actual: it compiles when the lazy implementation takes nothing too,
    // because a function with fewer parameters is assignable to one with more.
    // A one-argument call to the utility then returns its data-last function
    // instead of running it.
    curryWithLazy2(
      firstImplementation,
      firstLazyImplementation,
      1 /* argumentsLength */,
      [1],
      undefined,
    );
  });
});
