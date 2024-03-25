import { assertType, describe, expect, expectTypeOf, it } from 'vitest';

import { fromEntries } from './from-entries';

const tuples: Array<[string, number]> = [
  ['a', 1],
  ['b', 2],
  ['c', 3],
];

describe('runtime', () => {
  it('dataFirst', () => {
    expect(fromEntries(tuples)).toEqual({
      a: 1,
      b: 2,
      c: 3,
    });
  });
});

describe('typings', () => {
  it('arrays', () => {
    const actual = fromEntries(tuples);
    assertType<Record<string, number>>(actual);
  });
  it('arrays with mixed type value', () => {
    const actual = fromEntries<number | string>([
      ['a', 2],
      ['b', 'c'],
    ]);
    assertType<Record<string, number | string>>(actual);
  });
});

describe('strict (with readonly inputs)', () => {
  it('trivial empty case', () => {
    const result = fromEntries.strict([] as const);
    expectTypeOf(result).toEqualTypeOf({} as const);
    expect(result).toStrictEqual({});
  });

  it('trivial single entry const case', () => {
    const result = fromEntries.strict([['a', 1]] as const);
    expectTypeOf(result).toMatchTypeOf<{ a: 1 }>();
    expect(result).toStrictEqual({ a: 1 });
  });

  it('trivial multi entry const case', () => {
    const result = fromEntries.strict([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ] as const);
    expectTypeOf(result).toMatchTypeOf<{ a: 1; b: 2; c: 3 }>();
    expect(result).toStrictEqual({ a: 1, b: 2, c: 3 });
  });

  it('runtime empty well defined array', () => {
    const arr: ReadonlyArray<['a', 1] | ['b', 2] | ['c', 3]> = [];
    const result = fromEntries.strict(arr);
    expectTypeOf(result).toEqualTypeOf<{ a?: 1; b?: 2; c?: 3 }>();
    expect(result).toStrictEqual({});
  });

  it('runtime single value well defined array', () => {
    const arr: ReadonlyArray<['a', 1] | ['b', 2] | ['c', 3]> = [['a', 1]];
    const result = fromEntries.strict(arr);
    expectTypeOf(result).toEqualTypeOf<{ a?: 1; b?: 2; c?: 3 }>();
    expect(result).toStrictEqual({ a: 1 });
  });

  it('runtime multi-value well defined array', () => {
    const arr: ReadonlyArray<['a', 1] | ['b', 2] | ['c', 3]> = [
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ];
    const result = fromEntries.strict(arr);
    expectTypeOf(result).toEqualTypeOf<{ a?: 1; b?: 2; c?: 3 }>();
    expect(result).toStrictEqual({ a: 1, b: 2, c: 3 });
  });

  it('runtime mixed tuple with rest (first)', () => {
    const arr: readonly [['a', 1], ...ReadonlyArray<['b', 2] | ['c', 3]>] = [
      ['a', 1],
    ];
    const result = fromEntries.strict(arr);
    expectTypeOf(result).toMatchTypeOf<{ a: 1; b?: 2; c?: 3 }>();
    expect(result).toStrictEqual({ a: 1 });
  });

  it('runtime mixed tuple with rest (last)', () => {
    const arr: readonly [...ReadonlyArray<['b', 2] | ['c', 3]>, ['a', 1]] = [
      ['a', 1],
    ];
    const result = fromEntries.strict(arr);
    expectTypeOf(result).toMatchTypeOf<{ a: 1; b?: 2; c?: 3 }>();
    expect(result).toStrictEqual({ a: 1 });
  });

  it('runtime empty generic type', () => {
    const arr: ReadonlyArray<readonly [string, boolean]> = [];
    const result = fromEntries.strict(arr);
    expectTypeOf(result).toEqualTypeOf<Record<string, boolean>>();
    expect(result).toStrictEqual({});
  });

  it('runtime single value generic type', () => {
    const arr: ReadonlyArray<readonly [string, boolean]> = [['hello', true]];
    const result = fromEntries.strict(arr);
    expectTypeOf(result).toEqualTypeOf<Record<string, boolean>>();
    expect(result).toStrictEqual({ hello: true });
  });

  it('runtime multi-value generic type', () => {
    const arr: ReadonlyArray<readonly [string, boolean]> = [
      ['hello', true],
      ['world', false],
    ];
    const result = fromEntries.strict(arr);
    expectTypeOf(result).toEqualTypeOf<Record<string, boolean>>();
    expect(result).toStrictEqual({ hello: true, world: false });
  });

  it('mixed literals and generics', () => {
    const arr: ReadonlyArray<
      readonly ['a', 1] | readonly [`testing_${string}`, boolean]
    > = [['a', 1]];
    const result = fromEntries.strict(arr);
    expectTypeOf(result).toMatchTypeOf<
      Partial<Record<`testing_${string}`, boolean>> & { a?: 1 }
    >();
    expect(result).toStrictEqual({ a: 1 });
  });

  it('array with literal keys', () => {
    const arr: ReadonlyArray<readonly ['a' | 'b' | 'c', 'd']> = [['a', 'd']];
    const result = fromEntries.strict(arr);
    expectTypeOf(result).toEqualTypeOf<Partial<Record<'a' | 'b' | 'c', 'd'>>>();
    expect(result).toStrictEqual({ a: 'd' });
  });

  it('backwards compatibility (number)', () => {
    const arr: ReadonlyArray<readonly [number, 123]> = [[1, 123]];
    const result = fromEntries.strict(arr);
    expectTypeOf(result).toEqualTypeOf<Record<number, 123>>();
    expect(result).toStrictEqual({ 1: 123 });
  });

  it('backwards compatibility (string)', () => {
    const arr: ReadonlyArray<readonly [string, 123]> = [['a', 123]];
    const result = fromEntries.strict(arr);
    expectTypeOf(result).toEqualTypeOf<Record<string, 123>>();
    expect(result).toStrictEqual({ a: 123 });
  });
});

describe('strict (with non-readonly inputs)', () => {
  it('trivial empty case', () => {
    const result = fromEntries.strict([]);
    expectTypeOf(result).toEqualTypeOf({} as const);
    expect(result).toStrictEqual({});
  });

  it('trivial single entry const case', () => {
    const result = fromEntries.strict([['a', 1]]);
    expectTypeOf(result).toMatchTypeOf<Record<string, number>>();
    expect(result).toStrictEqual({ a: 1 });
  });

  it('trivial multi entry const case', () => {
    const result = fromEntries.strict([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);
    expectTypeOf(result).toMatchTypeOf<Record<string, number>>();
    expect(result).toStrictEqual({ a: 1, b: 2, c: 3 });
  });

  it('runtime empty well defined array', () => {
    const arr: Array<['a', 1] | ['b', 2] | ['c', 3]> = [];
    const result = fromEntries.strict(arr);
    expectTypeOf(result).toEqualTypeOf<{ a?: 1; b?: 2; c?: 3 }>();
    expect(result).toStrictEqual({});
  });

  it('runtime single value well defined array', () => {
    const arr: Array<['a', 1] | ['b', 2] | ['c', 3]> = [['a', 1]];
    const result = fromEntries.strict(arr);
    expectTypeOf(result).toEqualTypeOf<{ a?: 1; b?: 2; c?: 3 }>();
    expect(result).toStrictEqual({ a: 1 });
  });

  it('runtime multi-value well defined array', () => {
    const arr: Array<['a', 1] | ['b', 2] | ['c', 3]> = [
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ];
    const result = fromEntries.strict(arr);
    expectTypeOf(result).toEqualTypeOf<{ a?: 1; b?: 2; c?: 3 }>();
    expect(result).toStrictEqual({ a: 1, b: 2, c: 3 });
  });

  it('runtime mixed tuple with rest (first)', () => {
    const arr: [['a', 1], ...Array<['b', 2] | ['c', 3]>] = [['a', 1]];
    const result = fromEntries.strict(arr);
    expectTypeOf(result).toMatchTypeOf<{ a: 1; b?: 2; c?: 3 }>();
    expect(result).toStrictEqual({ a: 1 });
  });

  it('runtime mixed tuple with rest (last)', () => {
    const arr: [...Array<['b', 2] | ['c', 3]>, ['a', 1]] = [['a', 1]];
    const result = fromEntries.strict(arr);
    expectTypeOf(result).toMatchTypeOf<{ a: 1; b?: 2; c?: 3 }>();
    expect(result).toStrictEqual({ a: 1 });
  });

  it('runtime empty generic type', () => {
    const arr: Array<[string, boolean]> = [];
    const result = fromEntries.strict(arr);
    expectTypeOf(result).toEqualTypeOf<Record<string, boolean>>();
    expect(result).toStrictEqual({});
  });

  it('runtime single value generic type', () => {
    const arr: Array<[string, boolean]> = [['hello', true]];
    const result = fromEntries.strict(arr);
    expectTypeOf(result).toEqualTypeOf<Record<string, boolean>>();
    expect(result).toStrictEqual({ hello: true });
  });

  it('runtime multi-value generic type', () => {
    const arr: Array<[string, boolean]> = [
      ['hello', true],
      ['world', false],
    ];
    const result = fromEntries.strict(arr);
    expectTypeOf(result).toEqualTypeOf<Record<string, boolean>>();
    expect(result).toStrictEqual({ hello: true, world: false });
  });

  it('mixed literals and generics', () => {
    const arr: Array<['a', 1] | [`testing_${string}`, boolean]> = [['a', 1]];
    const result = fromEntries.strict(arr);
    expectTypeOf(result).toMatchTypeOf<
      Partial<Record<`testing_${string}`, boolean>> & { a?: 1 }
    >();
    expect(result).toStrictEqual({ a: 1 });
  });

  it('array with literal keys', () => {
    const arr: Array<readonly ['a' | 'b' | 'c', 'd']> = [['a', 'd']];
    const result = fromEntries.strict(arr);
    expectTypeOf(result).toEqualTypeOf<Partial<Record<'a' | 'b' | 'c', 'd'>>>();
    expect(result).toStrictEqual({ a: 'd' });
  });

  it('backwards compatibility (number)', () => {
    const arr: Array<[number, 123]> = [[1, 123]];
    const result = fromEntries.strict(arr);
    expectTypeOf(result).toEqualTypeOf<Record<number, 123>>();
    expect(result).toStrictEqual({ 1: 123 });
  });

  it('backwards compatibility (string)', () => {
    const arr: Array<[string, 123]> = [['a', 123]];
    const result = fromEntries.strict(arr);
    expectTypeOf(result).toEqualTypeOf<Record<string, 123>>();
    expect(result).toStrictEqual({ a: 123 });
  });
});
