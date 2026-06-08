import { describe, expectTypeOf, it, test } from 'vitest';
import { pipe } from './pipe';
import { splice } from './splice';

test('regular array', () => {
  expectTypeOf(splice([] as Array<number>, 0, 0, [9])).toEqualTypeOf<Array<number>>();
});

test('readonly array', () => {
  expectTypeOf(splice([] as ReadonlyArray<number>, 0, 0, [9])).toEqualTypeOf<
    Array<number>
  >();
});

test('regular array with union element type', () => {
  expectTypeOf(splice([] as Array<number | string>, 0, 0, [9, 'a'])).toEqualTypeOf<
    Array<number | string>
  >();
});

test('empty replacement preserves element type', () => {
  expectTypeOf(splice([] as Array<number>, 0, 0, [])).toEqualTypeOf<Array<number>>();
});

test('prefix tuple', () => {
  expectTypeOf(
    splice([1] as [number, ...Array<boolean>], 0, 0, [true]),
  ).toEqualTypeOf<Array<boolean | number>>();
});

test('suffix tuple', () => {
  expectTypeOf(
    splice([1] as [...Array<boolean>, number], 0, 0, [true]),
  ).toEqualTypeOf<Array<boolean | number>>();
});

test('prefix + suffix tuple', () => {
  expectTypeOf(
    splice([1, 'a'] as [number, ...Array<boolean>, string], 0, 0, [true]),
  ).toEqualTypeOf<Array<boolean | number | string>>();
});

test('const tuple', () => {
  expectTypeOf(splice([1, 'a', true] as const, 0, 0, [1])).toEqualTypeOf<
    Array<'a' | 1 | true>
  >();
});

test('union of arrays', () => {
  expectTypeOf(splice([] as Array<boolean> | Array<string>, 0, 0, [true])).toEqualTypeOf<
    Array<boolean | string>
  >();
});

test('accepts replacement element subtype', () => {
  expectTypeOf(splice([] as Array<number | string>, 0, 0, [9])).toEqualTypeOf<
    Array<number | string>
  >();
});

describe('rejects invalid replacement', () => {
  it('element type not in items\' element union', () => {
    // @ts-expect-error [ts2322] -- "a" not assignable to number
    splice([] as Array<number>, 0, 0, ['a']);
  });

  it('supertype replacement element', () => {
    // @ts-expect-error [ts2322] -- string is wider than "a" | "b"
    splice([] as Array<'a' | 'b'>, 0, 0, ['c' as string]);
  });

  it('literal outside const tuple\'s element union', () => {
    // @ts-expect-error [ts2322] -- 4 not in 1 | "a" | true
    splice([1, 'a', true] as const, 0, 0, [4]);
  });
});

test('replacement is optional', () => {
  expectTypeOf(splice([] as Array<number>, 0, 0)).toEqualTypeOf<Array<number>>();
});

describe('data-last', () => {
  it('regular array', () => {
    expectTypeOf(pipe([] as Array<number>, splice(0, 0, [9]))).toEqualTypeOf<
      Array<number>
    >();
  });

  it('readonly array', () => {
    expectTypeOf(
      pipe([] as ReadonlyArray<number>, splice(0, 0, [9])),
    ).toEqualTypeOf<Array<number>>();
  });

  it('regular array with union element type', () => {
    expectTypeOf(
      pipe([] as Array<number | string>, splice(0, 0, [9, 'a'])),
    ).toEqualTypeOf<Array<number | string>>();
  });

  it('empty replacement preserves element type', () => {
    expectTypeOf(pipe([] as Array<number>, splice(0, 0, []))).toEqualTypeOf<
      Array<number>
    >();
  });

  it('prefix tuple', () => {
    expectTypeOf(
      pipe([1] as [number, ...Array<boolean>], splice(0, 0, [true])),
    ).toEqualTypeOf<Array<boolean | number>>();
  });

  it('suffix tuple', () => {
    expectTypeOf(
      pipe([1] as [...Array<boolean>, number], splice(0, 0, [true])),
    ).toEqualTypeOf<Array<boolean | number>>();
  });

  it('prefix + suffix tuple', () => {
    expectTypeOf(
      pipe([1, 'a'] as [number, ...Array<boolean>, string], splice(0, 0, [true])),
    ).toEqualTypeOf<Array<boolean | number | string>>();
  });

  it('const tuple', () => {
    expectTypeOf(
      pipe([1, 'a', true] as const, splice(0, 0, [1])),
    ).toEqualTypeOf<Array<'a' | 1 | true>>();
  });

  it('union of arrays', () => {
    expectTypeOf(
      pipe([] as Array<boolean> | Array<string>, splice(0, 0, [true])),
    ).toEqualTypeOf<Array<boolean | string>>();
  });

  describe('rejects invalid replacement', () => {
    it('element type not in items\' element union', () => {
      // @ts-expect-error [ts2769] -- "a" not assignable to number
      pipe([] as Array<number>, splice(0, 0, ['a']));
    });

    it('supertype replacement element', () => {
      // @ts-expect-error [ts2769] -- string is wider than "a" | "b"
      pipe([] as Array<'a' | 'b'>, splice(0, 0, ['c' as string]));
    });

    it('literal outside const tuple\'s element union', () => {
      // @ts-expect-error [ts2769] -- 4 not in 1 | "a" | true
      pipe([1, 'a', true] as const, splice(0, 0, [4]));
    });
  });

  it('accepts replacement element subtype', () => {
    expectTypeOf(
      pipe([] as Array<number | string>, splice(0, 0, [9])),
    ).toEqualTypeOf<Array<number | string>>();
  });

  // @see https://github.com/remeda/remeda/pull/1358
  it('doesn\'t infer `never` from an empty `replacement` literal (#1358)', () => {
    expectTypeOf(pipe([] as Array<number>, splice(0, 0, []))).toEqualTypeOf<
      Array<number>
    >();
  });

  it('replacement is optional', () => {
    expectTypeOf(pipe([] as Array<number>, splice(0, 0))).toEqualTypeOf<Array<number>>();
  });
});
