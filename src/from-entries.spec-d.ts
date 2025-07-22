import { describe, expectTypeOf, it } from 'vitest';
import { fromEntries } from './from-entries';

describe('readonly inputs', () => {
  it('trivial empty case', () => {
    const result = fromEntries([] as const);
    expectTypeOf(result).toEqualTypeOf({} as const);
  });

  it('trivial single entry const case', () => {
    const result = fromEntries([['a', 1]] as const);
    expectTypeOf(result).toEqualTypeOf<{ a: 1 }>();
  });

  it('trivial multi entry const case', () => {
    const result = fromEntries([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ] as const);
    expectTypeOf(result).toEqualTypeOf<{ a: 1; b: 2; c: 3 }>();
  });

  it('empty well defined array', () => {
    const result = fromEntries(
      [] as ReadonlyArray<['a', 1] | ['b', 2] | ['c', 3]>,
    );
    expectTypeOf(result).toEqualTypeOf<{ a?: 1; b?: 2; c?: 3 }>();
  });

  it('mixed tuple with rest (first)', () => {
    const result = fromEntries([['a', 1]] as readonly [
      ['a', 1],
      ...ReadonlyArray<['b', 2] | ['c', 3]>,
    ]);
    expectTypeOf(result).toEqualTypeOf<{ a: 1; b?: 2; c?: 3 }>();
  });

  it('mixed tuple with rest (last)', () => {
    const result = fromEntries([['a', 1]] as readonly [
      ...ReadonlyArray<['b', 2] | ['c', 3]>,
      ['a', 1],
    ]);
    expectTypeOf(result).toEqualTypeOf<{ a: 1; b?: 2; c?: 3 }>();
  });

  it('empty generic type', () => {
    const result = fromEntries([] as ReadonlyArray<readonly [string, boolean]>);
    expectTypeOf(result).toEqualTypeOf<Record<string, boolean>>();
  });

  it('mixed literals and generics', () => {
    const result = fromEntries([['a', 1]] as ReadonlyArray<
      readonly ['a', 1] | readonly [`testing_${string}`, boolean]
    >);

    expectTypeOf(result).toEqualTypeOf<{
      [x: `testing_${string}`]: boolean | undefined;
      a?: 1;
    }>();
  });

  it('array with literal keys', () => {
    const result = fromEntries([['a', 'd']] as ReadonlyArray<
      readonly ['a' | 'b' | 'c', 'd']
    >);
    expectTypeOf(result).toEqualTypeOf<Partial<Record<'a' | 'b' | 'c', 'd'>>>();
  });

  it('backwards compatibility (number)', () => {
    const result = fromEntries([[1, 123]] as ReadonlyArray<
      readonly [number, 123]
    >);
    expectTypeOf(result).toEqualTypeOf<Record<number, 123>>();
  });

  it('backwards compatibility (string)', () => {
    const result = fromEntries([['a', 123]] as ReadonlyArray<
      readonly [string, 123]
    >);
    expectTypeOf(result).toEqualTypeOf<Record<string, 123>>();
  });
});

describe('non-readonly inputs', () => {
  it('trivial empty case', () => {
    const result = fromEntries([]);
    expectTypeOf(result).toEqualTypeOf({} as const);
  });

  it('trivial single entry const case', () => {
    const result = fromEntries([['a', 1]]);
    expectTypeOf(result).toEqualTypeOf<Record<string, number>>();
  });

  it('trivial multi entry const case', () => {
    const result = fromEntries([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);
    expectTypeOf(result).toEqualTypeOf<Record<string, number>>();
  });

  it('empty well defined array', () => {
    const result = fromEntries([] as Array<['a', 1] | ['b', 2] | ['c', 3]>);
    expectTypeOf(result).toEqualTypeOf<{ a?: 1; b?: 2; c?: 3 }>();
  });

  it('mixed tuple with rest (first)', () => {
    const result = fromEntries([['a', 1]] as [
      ['a', 1],
      ...Array<['b', 2] | ['c', 3]>,
    ]);
    expectTypeOf(result).toEqualTypeOf<{ a: 1; b?: 2; c?: 3 }>();
  });

  it('mixed tuple with rest (last)', () => {
    const result = fromEntries([['a', 1]] as [
      ...Array<['b', 2] | ['c', 3]>,
      ['a', 1],
    ]);
    expectTypeOf(result).toEqualTypeOf<{ a: 1; b?: 2; c?: 3 }>();
  });

  it('empty generic type', () => {
    const result = fromEntries([] as Array<[string, boolean]>);
    expectTypeOf(result).toEqualTypeOf<Record<string, boolean>>();
  });

  it('mixed literals and generics', () => {
    const result = fromEntries([['a', 1]] as Array<
      ['a', 1] | [`testing_${string}`, boolean]
    >);
    expectTypeOf(result).toEqualTypeOf<{
      [x: `testing_${string}`]: boolean | undefined;
      a?: 1;
    }>();
  });

  it('array with literal keys', () => {
    const result = fromEntries([['a', 'd']] as Array<
      readonly ['a' | 'b' | 'c', 'd']
    >);
    expectTypeOf(result).toEqualTypeOf<Partial<Record<'a' | 'b' | 'c', 'd'>>>();
  });

  it('backwards compatibility (number)', () => {
    const result = fromEntries([[1, 123]] as Array<[number, 123]>);
    expectTypeOf(result).toEqualTypeOf<Record<number, 123>>();
  });

  it('backwards compatibility (string)', () => {
    const result = fromEntries([['a', 123]] as Array<[string, 123]>);
    expectTypeOf(result).toEqualTypeOf<Record<string, 123>>();
  });
});
