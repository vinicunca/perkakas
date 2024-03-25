import { describe, expect, expectTypeOf, it } from 'vitest';

import { pipe } from '../pipe';
import { only } from './only';

describe('data first', () => {
  it('empty array', () => {
    expect(only([])).toBeUndefined();
  });

  it('length 1 array', () => {
    expect(only([1])).toEqual(1);
  });

  it('length 2 array', () => {
    expect(only([1, 2])).toBeUndefined();
  });
});

describe('data last', () => {
  it('empty array', () => {
    expect(pipe([], only())).toBeUndefined();
  });

  it('length 1 array', () => {
    expect(pipe([1], only())).toEqual(1);
  });

  it('length 2 array', () => {
    expect(pipe([1, 2], only())).toBeUndefined();
  });
});

describe('strict typing', () => {
  it('simple empty array', () => {
    const arr: Array<number> = [];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<number | undefined>();
    expect(result).toBeUndefined();
  });

  it('simple array', () => {
    const arr: Array<number> = [1];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<number | undefined>();
    expect(result).toEqual(1);
  });

  it('simple non-empty array', () => {
    const arr: [number, ...Array<number>] = [1];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<number | undefined>();
    expect(result).toEqual(1);
  });

  it('simple tuple', () => {
    const arr: [number, string] = [1, 'a'];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<undefined>();
    expect(result).toBeUndefined();
  });

  it('array with more than one item', () => {
    const arr: [number, number, ...Array<number>] = [1, 2];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<undefined>();
    expect(result).toBeUndefined();
  });

  it('trivial empty array', () => {
    const arr: [] = [];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf(undefined);
    expect(result).toBeUndefined();
  });

  it('array with last', () => {
    const arr: [...Array<number>, number] = [1];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<number | undefined>();
    expect(result).toEqual(1);
  });

  it('tuple with last', () => {
    const arr: [...Array<string>, number] = ['a', 1];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<number | string | undefined>();
    expect(result).toBeUndefined();
  });

  it('tuple with two last', () => {
    const arr: [...Array<string>, number, number] = ['a', 1, 2];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<undefined>();
    expect(result).toBeUndefined();
  });

  it('tuple with first and last', () => {
    const arr: [number, ...Array<string>, number] = [1, 'a', 2];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<undefined>();
    expect(result).toBeUndefined();
  });

  it('tuple with optional and array', () => {
    const arr: [string?, ...Array<number>] = ['a', 1];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<number | string | undefined>();
    expect(result).toBeUndefined();
  });

  it('tuple with all optional', () => {
    const arr: [string?, number?] = ['a', 1];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<number | string | undefined>();
    expect(result).toBeUndefined();
  });

  it('simple empty readonly array', () => {
    const arr: ReadonlyArray<number> = [];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<number | undefined>();
    expect(result).toBeUndefined();
  });

  it('simple readonly array', () => {
    const arr: ReadonlyArray<number> = [1];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<number | undefined>();
    expect(result).toEqual(1);
  });

  it('simple non-empty readonly array', () => {
    const arr: readonly [number, ...Array<number>] = [1];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<number | undefined>();
    expect(result).toEqual(1);
  });

  it('simple readonly tuple', () => {
    const arr: readonly [number, string] = [1, 'a'];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<undefined>();
    expect(result).toBeUndefined();
  });

  it('readonly array with more than one item', () => {
    const arr: readonly [number, number, ...Array<number>] = [1, 2];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<undefined>();
    expect(result).toBeUndefined();
  });

  it('readonly trivial empty array', () => {
    const arr: readonly [] = [];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf(undefined);
    expect(result).toBeUndefined();
  });

  it('readonly array with last', () => {
    const arr: readonly [...Array<number>, number] = [1];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<number | undefined>();
    expect(result).toEqual(1);
  });

  it('readonly tuple with last', () => {
    const arr: readonly [...Array<string>, number] = ['a', 1];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<number | string | undefined>();
    expect(result).toBeUndefined();
  });

  it('readonly tuple with optional and array', () => {
    const arr: readonly [string?, ...Array<number>] = ['a', 1];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<number | string | undefined>();
    expect(result).toBeUndefined();
  });

  it('readonly tuple with all optional', () => {
    const arr: readonly [string?, number?] = ['a', 1];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<number | string | undefined>();
    expect(result).toBeUndefined();
  });
});
