import { describe, expect, expectTypeOf, it } from 'vitest';

import type { NonEmptyArray } from './_types';

import { chunk } from './chunk';

describe('data first', () => {
  it('equal size', () => {
    expect(chunk(['a', 'b', 'c', 'd'] as const, 2)).toEqual([
      ['a', 'b'],
      ['c', 'd'],
    ]);
  });

  it('not equal size', () => {
    expect(chunk(['a', 'b', 'c', 'd'] as const, 3)).toEqual([
      ['a', 'b', 'c'],
      ['d'],
    ]);
  });

  it('1 element', () => {
    expect(chunk(['x'] as const, 3)).toEqual([['x']]);
  });

  it('empty array', () => {
    expect(chunk([] as const, 3)).toEqual([]);
  });
});

describe('data last', () => {
  it('equal size', () => {
    expect(chunk(2)(['a', 'b', 'c', 'd'] as const)).toEqual([
      ['a', 'b'],
      ['c', 'd'],
    ]);
  });
});

describe('strict typing', () => {
  it('empty tuple', () => {
    const input: [] = [];
    const result = chunk(input, 2);
    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  it('readonly empty tuple', () => {
    const input = [] as const;
    const result = chunk(input, 2);
    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  it('array', () => {
    const input: Array<number> = [];
    const result = chunk(input, 2);
    expectTypeOf(result).toEqualTypeOf<Array<NonEmptyArray<number>>>();
  });

  it('readonly array', () => {
    const input: ReadonlyArray<number> = [];
    const result = chunk(input, 2);
    expectTypeOf(result).toEqualTypeOf<Array<NonEmptyArray<number>>>();
  });

  it('tuple', () => {
    const input: [number, number, number] = [123, 456, 789];
    const result = chunk(input, 2);
    expectTypeOf(result).toEqualTypeOf<NonEmptyArray<NonEmptyArray<number>>>();
  });

  it('readonly tuple', () => {
    const input: readonly [number, number, number] = [123, 456, 789];
    const result = chunk(input, 2);
    expectTypeOf(result).toEqualTypeOf<NonEmptyArray<NonEmptyArray<number>>>();
  });

  it('tuple with rest tail', () => {
    const input: [number, ...Array<number>] = [123, 456];
    const result = chunk(input, 2);
    expectTypeOf(result).toEqualTypeOf<NonEmptyArray<NonEmptyArray<number>>>();
  });

  it('readonly tuple with rest tail', () => {
    const input: readonly [number, ...Array<number>] = [123, 456];
    const result = chunk(input, 2);
    expectTypeOf(result).toEqualTypeOf<NonEmptyArray<NonEmptyArray<number>>>();
  });

  it('tuple with rest middle', () => {
    const input: [number, ...Array<number>, number] = [123, 456];
    const result = chunk(input, 2);
    expectTypeOf(result).toEqualTypeOf<NonEmptyArray<NonEmptyArray<number>>>();
  });

  it('readonly tuple with rest middle', () => {
    const input: readonly [number, ...Array<number>, number] = [123, 456];
    const result = chunk(input, 2);
    expectTypeOf(result).toEqualTypeOf<NonEmptyArray<NonEmptyArray<number>>>();
  });

  it('tuple with rest head', () => {
    const input: [...Array<number>, number] = [123, 456];
    const result = chunk(input, 2);
    expectTypeOf(result).toEqualTypeOf<NonEmptyArray<NonEmptyArray<number>>>();
  });

  it('readonly tuple with rest head', () => {
    const input: readonly [...Array<number>, number] = [123, 456];
    const result = chunk(input, 2);
    expectTypeOf(result).toEqualTypeOf<NonEmptyArray<NonEmptyArray<number>>>();
  });
});
