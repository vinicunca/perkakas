import { describe, expectTypeOf, it } from 'vitest';
import { curry1, curry2, curry3 } from './curry-by-arity';

declare function subtractImplementation(
  minuend: number,
  subtrahend: number,
): number;

declare function subtractOptionalImplementation(
  minuend: number,
  subtrahend?: number,
): number;

declare function negateImplementation(data: number): number;

declare function isEqualImplementation(data: unknown, other: unknown): boolean;

it('return type', () => {
  expectTypeOf(
    curry2(subtractImplementation, 2 /* argumentsLength */, 1, 2),
  ).toEqualTypeOf<number | ((data: number) => number)>();
});

describe('arity', () => {
  it('matches the data-first parameters', () => {
    curry1(
      // @ts-expect-error [ts2345] -- `subtractImplementation` takes 2 parameters, so `curry1` doesn't fit it.
      subtractImplementation,
      1 /* argumentsLength */,
      1,
    );
  });

  it('rejects optional parameters', () => {
    curry2(
      // @ts-expect-error [ts2345] -- A data-last call can't tell an omitted optional argument from the data, so implementations declare none.
      subtractOptionalImplementation,
      2 /* argumentsLength */,
      1,
      2,
    );
    curry1(
      // @ts-expect-error [ts2345] -- `curry1`'s data-last function is the implementation itself, so a point-free caller's extra arguments would fill the optional parameter.
      subtractOptionalImplementation,
      1 /* argumentsLength */,
      1,
    );
  });
});

describe('known issues!', () => {
  it('an implementation with fewer parameters than the helper', () => {
    // Expected: both calls are rejected, like `curry1(subtractImplementation)`
    // is (see "matches the data-first parameters").
    //
    // Actual: they compile whenever the parameters after the data accept
    // `unknown`, because a function with fewer parameters is assignable to one
    // with more, and `P` falls back to `unknown` for every parameter it can't
    // infer. A call to the utility with the implementation's arity then
    // returns its data-last function instead of running it.
    curry2(negateImplementation, 1 /* argumentsLength */, 1, undefined);
    curry3(isEqualImplementation, 2 /* argumentsLength */, 1, 2, undefined);
  });
});
