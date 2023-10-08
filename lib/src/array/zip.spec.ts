import { assertType, describe, expect, it } from 'vitest';
import { zip } from './zip';

const first = [1, 2, 3];
const second = ['a', 'b', 'c'];
const shorterFirst = [1, 2];
const shorterSecond = ['a', 'b'];

describe('data first', () => {
  it('should zip', () => {
    expect(zip(first, second)).toEqual([
      [1, 'a'],
      [2, 'b'],
      [3, 'c'],
    ]);
  });
  it('should truncate to shorter second', () => {
    expect(zip(first, shorterSecond)).toEqual([
      [1, 'a'],
      [2, 'b'],
    ]);
  });
  it('should truncate to shorter first', () => {
    expect(zip(shorterFirst, second)).toEqual([
      [1, 'a'],
      [2, 'b'],
    ]);
  });
});

describe('data first typings', () => {
  it('arrays', () => {
    const actual = zip(first, second);
    assertType<Array<[number, string]>>(actual);
  });
  it('tuples', () => {
    const actual = zip(first as [1, 2, 3], second as ['a', 'b', 'c']);
    assertType<Array<[1 | 2 | 3, 'a' | 'b' | 'c']>>(actual);
  });
  it('variadic tuples', () => {
    const firstVariadic: [number, ...Array<string>] = [1, 'b', 'c'];
    const secondVariadic: [string, ...Array<number>] = ['a', 2, 3];
    const actual = zip(firstVariadic, secondVariadic);
    assertType<Array<[string | number, string | number]>>(actual);
  });
});

describe('data second', () => {
  it('should zip', () => {
    expect(zip(second)(first)).toEqual([
      [1, 'a'],
      [2, 'b'],
      [3, 'c'],
    ]);
  });
  it('should truncate to shorter second', () => {
    expect(zip(shorterSecond)(first)).toEqual([
      [1, 'a'],
      [2, 'b'],
    ]);
  });
  it('should truncate to shorter first', () => {
    expect(zip(second)(shorterFirst)).toEqual([
      [1, 'a'],
      [2, 'b'],
    ]);
  });
});

describe('data second typings', () => {
  it('arrays', () => {
    const actual = zip(second)(first);
    assertType<Array<[number, string]>>(actual);
  });
  it('tuples', () => {
    const actual = zip(second as ['a', 'b', 'c'])(first as [1, 2, 3]);
    assertType<Array<[1 | 2 | 3, 'a' | 'b' | 'c']>>(actual);
  });
  it('variadic tuples', () => {
    const firstVariadic: [number, ...Array<string>] = [1, 'b', 'c'];
    const secondVariadic: [string, ...Array<number>] = ['a', 2, 3];
    const actual = zip(secondVariadic)(firstVariadic);
    assertType<Array<[string | number, string | number]>>(actual);
  });
});