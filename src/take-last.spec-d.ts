import { describe, expectTypeOf, it } from 'vitest';
import { pipe } from './pipe';
import { takeLast } from './take-last';

describe('data-first', () => {
  it('empty array', () => {
    const result = takeLast([] as [], 2);

    expectTypeOf(result).toEqualTypeOf<Array<never>>();
  });

  it('regular array', () => {
    const result = takeLast([] as Array<number>, 2);

    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  it('regular array with union type', () => {
    const result = takeLast([] as Array<number | string>, 2);

    expectTypeOf(result).toEqualTypeOf<Array<number | string>>();
  });

  it('prefix array', () => {
    const result = takeLast([1] as [number, ...Array<boolean>], 2);

    expectTypeOf(result).toEqualTypeOf<Array<boolean | number>>();
  });

  it('suffix array', () => {
    const result = takeLast([1] as [...Array<boolean>, number], 2);

    expectTypeOf(result).toEqualTypeOf<Array<boolean | number>>();
  });

  it('array with suffix and prefix', () => {
    const result = takeLast([1, 'a'] as [number, ...Array<boolean>, string], 2);

    expectTypeOf(result).toEqualTypeOf<Array<boolean | number | string>>();
  });

  it('tuple', () => {
    const result = takeLast([1, 'a', true] as const, 2);

    expectTypeOf(result).toEqualTypeOf<Array<'a' | 1 | true>>();
  });

  it('union of arrays', () => {
    const result = takeLast([] as Array<boolean> | Array<string>, 2);

    expectTypeOf(result).toEqualTypeOf<Array<boolean | string>>();
  });
});

describe('data-last', () => {
  it('empty array', () => {
    const result = pipe([] as [], takeLast(2));

    expectTypeOf(result).toEqualTypeOf<Array<never>>();
  });

  it('regular array', () => {
    const result = pipe([] as Array<number>, takeLast(2));

    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  it('regular array with union type', () => {
    const result = pipe([] as Array<number | string>, takeLast(2));

    expectTypeOf(result).toEqualTypeOf<Array<number | string>>();
  });

  it('prefix array', () => {
    const result = pipe([1] as [number, ...Array<boolean>], takeLast(2));

    expectTypeOf(result).toEqualTypeOf<Array<boolean | number>>();
  });

  it('suffix array', () => {
    const result = pipe([1] as [...Array<boolean>, number], takeLast(2));

    expectTypeOf(result).toEqualTypeOf<Array<boolean | number>>();
  });

  it('array with suffix and prefix', () => {
    const result = pipe(
      [1, 'a'] as [number, ...Array<boolean>, string],
      takeLast(2),
    );

    expectTypeOf(result).toEqualTypeOf<Array<boolean | number | string>>();
  });

  it('tuple', () => {
    const result = pipe([1, 'a', true] as const, takeLast(2));

    expectTypeOf(result).toEqualTypeOf<Array<'a' | 1 | true>>();
  });

  it('union of arrays', () => {
    const result = pipe([] as Array<boolean> | Array<string>, takeLast(2));

    expectTypeOf(result).toEqualTypeOf<Array<boolean | string>>();
  });
});
