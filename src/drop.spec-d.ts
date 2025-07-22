import { describe, expectTypeOf, it } from 'vitest';
import { drop } from './drop';
import { pipe } from './pipe';

describe('data-first', () => {
  it('empty array', () => {
    const result = drop([] as [], 2);

    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  it('regular array', () => {
    const result = drop([] as Array<number>, 2);

    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  it('regular array with union type', () => {
    const result = drop([] as Array<number | string>, 2);

    expectTypeOf(result).toEqualTypeOf<Array<number | string>>();
  });

  it('prefixed array', () => {
    const result = drop([1] as [number, ...Array<boolean>], 2);

    expectTypeOf(result).toEqualTypeOf<Array<boolean>>();
  });

  it('suffixed array', () => {
    const result = drop([1] as [...Array<boolean>, number], 2);

    expectTypeOf(result).toEqualTypeOf<[...Array<boolean>, number] | []>();
  });

  describe('arrays with a prefix (2) and a suffix (2)', () => {
    it('n === 0 (no drop)', () => {
      const result = drop(
        [1, 2, 'a', 'b'] as [number, number, ...Array<boolean>, string, string],
        0,
      );

      expectTypeOf(result).toEqualTypeOf<
        [number, number, ...Array<boolean>, string, string]
      >();
    });

    it('n === 1 (drop from the prefix)', () => {
      const result = drop(
        [1, 2, 'a', 'b'] as [number, number, ...Array<boolean>, string, string],
        1,
      );

      expectTypeOf(result).toEqualTypeOf<
        [number, ...Array<boolean>, string, string]
      >();
    });

    it('n === 2 (remove the prefix)', () => {
      const result = drop(
        [1, 2, 'a', 'b'] as [number, number, ...Array<boolean>, string, string],
        2,
      );

      expectTypeOf(result).toEqualTypeOf<[...Array<boolean>, string, string]>();
    });

    it('n === 3 (drop the whole prefix, remove from the suffix)', () => {
      const result = drop(
        [1, 2, 'a', 'b'] as [number, number, ...Array<boolean>, string, string],
        3,
      );

      expectTypeOf(result).toEqualTypeOf<
        [...Array<boolean>, string, string] | [string]
      >();
    });

    it('n === 4 (drop the whole prefix, drop the whole suffix)', () => {
      const result = drop(
        [1, 2, 'a', 'b'] as [number, number, ...Array<boolean>, string, string],
        4,
      );

      expectTypeOf(result).toEqualTypeOf<
        [...Array<boolean>, string, string] | [] | [string]
      >();
    });

    it('n > 4 (drop more than the constant parts of the array)', () => {
      const result = drop(
        [1, 2, 'a', 'b'] as [number, number, ...Array<boolean>, string, string],
        5,
      );

      expectTypeOf(result).toEqualTypeOf<
        [...Array<boolean>, string, string] | [] | [string]
      >();
    });
  });

  it('tuple', () => {
    const result = drop([1, 'a', true] as const, 2);

    expectTypeOf(result).toEqualTypeOf<[true]>();
  });

  it('union of arrays', () => {
    const result = drop([] as Array<boolean> | Array<string>, 2);

    expectTypeOf(result).toEqualTypeOf<Array<boolean | string>>();
  });

  it('negative count', () => {
    const result = drop([] as Array<number>, -1);

    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  it('generalized typed count', () => {
    const result = drop(['a', 1, true] as const, 1 as number);

    expectTypeOf(result).toEqualTypeOf<Array<'a' | 1 | true>>();
  });

  it('union of tuples of different length', () => {
    expectTypeOf(
      drop([1, 'a'] as [number, string] | [boolean, boolean, number], 1),
    ).toEqualTypeOf<[string] | [boolean, number]>();
  });

  it('dropping more than available', () => {
    expectTypeOf(drop([1, 2, 3] as const, 10)).toEqualTypeOf<[]>();
  });
});

describe('data-last', () => {
  it('empty array', () => {
    const result = pipe([] as [], drop(2));

    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  it('regular array', () => {
    const result = pipe([] as Array<number>, drop(2));

    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  it('regular array with union type', () => {
    const result = pipe([] as Array<number | string>, drop(2));

    expectTypeOf(result).toEqualTypeOf<Array<number | string>>();
  });

  it('prefix array', () => {
    const result = pipe([1] as [number, ...Array<boolean>], drop(2));

    expectTypeOf(result).toEqualTypeOf<Array<boolean>>();
  });

  it('suffix array', () => {
    const result = pipe([1] as [...Array<boolean>, number], drop(2));

    expectTypeOf(result).toEqualTypeOf<[...Array<boolean>, number] | []>();
  });

  it('array with suffix and prefix', () => {
    const result = pipe(
      [1, 'a'] as [number, ...Array<boolean>, string],
      drop(2),
    );

    expectTypeOf(result).toEqualTypeOf<[...Array<boolean>, string] | []>();
  });

  it('tuple', () => {
    const result = pipe([1, 'a', true] as const, drop(2));

    expectTypeOf(result).toEqualTypeOf<[true]>();
  });

  it('union of arrays', () => {
    const result = pipe([] as Array<boolean> | Array<string>, drop(2));

    expectTypeOf(result).toEqualTypeOf<Array<boolean | string>>();
  });

  it('negative count', () => {
    const result = pipe([] as Array<number>, drop(-1));

    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  it('generalized typed count', () => {
    const result = pipe([] as Array<number>, drop(1 as number));

    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });
});
