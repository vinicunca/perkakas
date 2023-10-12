import { describe, expect, expectTypeOf, it } from 'vitest';
import { zipObj } from './zip-obj';

const first = ['a', 'b', 'c'];
const second = [1, 2, 3];
const shorterSecond = [1, 2];
const shorterFirst = ['a', 'b'];

describe('data first', () => {
  it('should zipObj', () => {
    expect(zipObj(first, second)).toEqual({
      a: 1,
      b: 2,
      c: 3,
    });
  });
  it('should truncate to shorter second', () => {
    expect(zipObj(first, shorterSecond)).toEqual({
      a: 1,
      b: 2,
    });
  });
  it('should truncate to shorter first', () => {
    expect(zipObj(shorterFirst, second)).toEqual({
      a: 1,
      b: 2,
    });
  });
});

describe('data first typings', () => {
  it('arrays', () => {
    const actual = zipObj(first, second);
    expectTypeOf(actual).toEqualTypeOf<Record<string, number>>();
  });
  it('tuples', () => {
    const actual = zipObj(first as ['a', 'b', 'c'], second as [1, 2, 3]);
    expectTypeOf(actual).toEqualTypeOf<Record<'a' | 'b' | 'c', 1 | 2 | 3>>();
  });
  it('variadic tuples', () => {
    const firstVariadic: [number, ...Array<string>] = [1, 'b', 'c'];
    const secondVariadic: [string, ...Array<number>] = ['a', 2, 3];
    const actual = zipObj(firstVariadic, secondVariadic);
    expectTypeOf(actual).toEqualTypeOf<
    Record<string | number, number | string>
    >();
  });
});

describe('data last', () => {
  it('should zip', () => {
    expect(zipObj(second)(first)).toEqual({
      a: 1,
      b: 2,
      c: 3,
    });
  });
  it('should truncate to shorter second', () => {
    expect(zipObj(shorterSecond)(first)).toEqual({
      a: 1,
      b: 2,
    });
  });
  it('should truncate to shorter first', () => {
    expect(zipObj(second)(shorterFirst)).toEqual({
      a: 1,
      b: 2,
    });
  });
});

describe('data last typings', () => {
  it('arrays', () => {
    const actual = zipObj(second)(first);
    expectTypeOf(actual).toEqualTypeOf<Record<string, number>>();
  });
  it('tuples', () => {
    const actual = zipObj(second as [1, 2, 3])(first as ['a', 'b', 'c']);
    expectTypeOf(actual).toEqualTypeOf<Record<'a' | 'b' | 'c', 1 | 2 | 3>>();
  });
  it('variadic tuples', () => {
    const firstVariadic: [number, ...Array<string>] = [1, 'b', 'c'];
    const secondVariadic: [string, ...Array<number>] = ['a', 2, 3];
    const actual = zipObj(secondVariadic)(firstVariadic);
    expectTypeOf(actual).toEqualTypeOf<
    Record<string | number, string | number>
    >();
  });
});
