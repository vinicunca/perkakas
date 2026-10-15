import { describe, expectTypeOf, it } from 'vitest';
import { curry } from './curry';
import { sum } from './sum';

// @ts-expect-error [ts6133] -- The assertions are on the helpers themselves: one compiles, the other's mismatched overload fails (see its `@ts-expect-error`). These references only keep them from being unused.

const _DUMMY = {
  subtractWithMatchingOverloads,
  subtractWithMismatchedOverload,
};

it('return type', () => {
  expectTypeOf(curry(subtractImplementation, [])).toEqualTypeOf<
    number | ((data: number) => number)
  >();
});

describe('known issues!', () => {
  it('a function **reference** is typed by its last declared overload, regardless of the arguments it\'s called with', () => {
    // `map` calls its callback with 3 arguments (value, index, array), so curry
    // runs both functions data-first and they return numbers at runtime. The
    // index is a number, so the data-first signature fits the callback too.
    //
    // When a function is passed by reference, TypeScript only looks at its last
    // declared overload.
    const result = [1, 2, 3].map(dataLastDeclaredLast);

    expectTypeOf(result).not.toEqualTypeOf<Array<number>>();

    // Actual
    expectTypeOf(result).toEqualTypeOf<Array<(minuend: number) => number>>();
    expectTypeOf([1, 2, 3].map(dataFirstDeclaredLast)).toEqualTypeOf<
      Array<number>
    >();
  });

  it('remeda\'s own utilities passed by reference are typed by their data-last overload', () => {
    // Every utility declares its data-last overload last, so the limitation
    // above applies to all of them: at runtime this returns `[3, 3]`.
    const result = [[1, 2], [3]].map(sum);

    expectTypeOf(result).not.toEqualTypeOf<Array<number>>();

    // Actual
    expectTypeOf(result).items.toBeFunction();
  });

  it('declaring the data-first overload last doesn\'t fix generic functions', () => {
    // TypeScript only carries type parameters through a function reference when
    // the function has a single signature. For an overloaded function it
    // replaces them with their constraints instead.
    const result = [[1], [2], [3]].map(genericDataFirstDeclaredLast);

    expectTypeOf(result).not.toEqualTypeOf<Array<number | undefined>>();

    // Actual
    expectTypeOf(result).toEqualTypeOf<Array<unknown>>();
  });

  it('a generic `dataFirst` is typed by its constraints', () => {
    // Nothing in `args` binds the type parameters of `dataFirst`, and the union
    // `curry` returns can't carry them the way a returned function type could,
    // so TypeScript replaces them with their constraints. The resulting
    // `unknown` absorbs the whole union. An instantiation expression binds them.
    const result = curry(firstImplementation, []);

    expectTypeOf(result).not.toEqualTypeOf(
      curry(firstImplementation<number>, []),
    );

    // Actual
    expectTypeOf(result).toBeUnknown();
  });

  it('an overloaded `dataFirst` is typed by its last overload', () => {
    // TypeScript infers from the last overload of a function passed by
    // reference, which for `Object.fromEntries` is the one returning `any`. An
    // instantiation expression selects the typed overload.

    const result = curry(Object.fromEntries, []);

    expectTypeOf(result).not.toEqualTypeOf(
      curry(Object.fromEntries<unknown>, []),
    );

    // Actual
    expectTypeOf(result).toBeAny();
  });
});

function dataLastDeclaredLast(minuend: number, subtrahend: number): number;
function dataLastDeclaredLast(subtrahend: number): (minuend: number) => number;

function dataLastDeclaredLast(...args: ReadonlyArray<unknown>): unknown {
  return curry(subtractImplementation, args);
}

function dataFirstDeclaredLast(subtrahend: number): (minuend: number) => number;
function dataFirstDeclaredLast(minuend: number, subtrahend: number): number;

function dataFirstDeclaredLast(...args: ReadonlyArray<unknown>): unknown {
  return curry(subtractImplementation, args);
}

function subtractWithMatchingOverloads(
  minuend: number,
  subtrahend: number,
): number;
function subtractWithMatchingOverloads(
  subtrahend: number,
): (minuend: number) => number;

// eslint-disable-next-line ts/explicit-function-return-type -- Intentional! we want to test `curry`s inferred return type.
function subtractWithMatchingOverloads(...args: ReadonlyArray<unknown>) {
  return curry(subtractImplementation, args);
}

// @ts-expect-error [ts2394] -- Mismatched on purpose: the overload claims a `string`, but `subtractImplementation` returns a `number`.
function subtractWithMismatchedOverload(
  minuend: number,
  subtrahend: number,
): string;
function subtractWithMismatchedOverload(
  subtrahend: number,
): (minuend: number) => number;

// eslint-disable-next-line ts/explicit-function-return-type -- Intentional! we want to test `curry`s inferred return type.
function subtractWithMismatchedOverload(...args: ReadonlyArray<unknown>) {
  return curry(subtractImplementation, args);
}

function subtractImplementation(minuend: number, subtrahend: number): number {
  return minuend - subtrahend;
}

function genericDataFirstDeclaredLast(): <T>(
  data: ReadonlyArray<T>,
) => T | undefined;
function genericDataFirstDeclaredLast<T>(data: ReadonlyArray<T>): T | undefined;

function genericDataFirstDeclaredLast(...args: ReadonlyArray<unknown>): unknown {
  return curry(firstImplementation, args);
}

function firstImplementation<T>(data: ReadonlyArray<T>): T | undefined {
  return data[0];
}
