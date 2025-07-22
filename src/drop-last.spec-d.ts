import { describe, expectTypeOf, it } from 'vitest';
import { dropLast } from './drop-last';
import { pipe } from './pipe';

describe('data-first', () => {
  it('empty array', () => {
    const result = dropLast([] as [], 2);
    expectTypeOf(result).toEqualTypeOf<Array<never>>();
  });

  it('regular array', () => {
    const result = dropLast([] as Array<number>, 2);
    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  it('regular array with union type', () => {
    const result = dropLast([] as Array<number | string>, 2);
    expectTypeOf(result).toEqualTypeOf<Array<number | string>>();
  });

  it('prefix array', () => {
    const result = dropLast([1] as [number, ...Array<boolean>], 2);
    expectTypeOf(result).toEqualTypeOf<Array<boolean | number>>();
  });

  it('suffix array', () => {
    const result = dropLast([1] as [...Array<boolean>, number], 2);
    expectTypeOf(result).toEqualTypeOf<Array<boolean | number>>();
  });

  it('array with suffix and prefix', () => {
    const result = dropLast([1, 'a'] as [number, ...Array<boolean>, string], 2);
    expectTypeOf(result).toEqualTypeOf<Array<boolean | number | string>>();
  });

  it('tuple', () => {
    const result = dropLast([1, 'a', true] as const, 2);
    expectTypeOf(result).toEqualTypeOf<Array<'a' | 1 | true>>();
  });

  it('union of arrays', () => {
    const result = dropLast([] as Array<boolean> | Array<string>, 2);
    expectTypeOf(result).toEqualTypeOf<Array<boolean | string>>();
  });
});

describe('data-last', () => {
  it('empty array', () => {
    const result = pipe([] as [], dropLast(2));
    expectTypeOf(result).toEqualTypeOf<Array<never>>();
  });

  it('regular array', () => {
    const result = pipe([] as Array<number>, dropLast(2));
    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  it('regular array with union type', () => {
    const result = pipe([] as Array<number | string>, dropLast(2));
    expectTypeOf(result).toEqualTypeOf<Array<number | string>>();
  });

  it('prefix array', () => {
    const result = pipe([1] as [number, ...Array<boolean>], dropLast(2));
    expectTypeOf(result).toEqualTypeOf<Array<boolean | number>>();
  });

  it('suffix array', () => {
    const result = pipe([1] as [...Array<boolean>, number], dropLast(2));
    expectTypeOf(result).toEqualTypeOf<Array<boolean | number>>();
  });

  it('array with suffix and prefix', () => {
    const result = pipe(
      [1, 'a'] as [number, ...Array<boolean>, string],
      dropLast(2),
    );
    expectTypeOf(result).toEqualTypeOf<Array<boolean | number | string>>();
  });

  it('tuple', () => {
    const result = pipe([1, 'a', true] as const, dropLast(2));
    expectTypeOf(result).toEqualTypeOf<Array<'a' | 1 | true>>();
  });

  it('union of arrays', () => {
    const result = pipe([] as Array<boolean> | Array<string>, dropLast(2));
    expectTypeOf(result).toEqualTypeOf<Array<boolean | string>>();
  });
});
