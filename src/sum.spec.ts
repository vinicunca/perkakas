import { describe, expect, it } from 'vitest';
import { pipe } from './pipe';
import { sum } from './sum';

describe('dataFirst', () => {
  it('should return the sum of numbers in an array', () => {
    expect(sum([1, 2, 3])).toBe(6);
    expect(sum([4, 5, 6])).toBe(15);
    expect(sum([-1, 0, 1])).toBe(0);
  });

  it('should return 0 for an empty array', () => {
    expect(sum([])).toBe(0);
  });

  it('works on bigints', () => {
    expect(sum([1n, 2n, 3n])).toBe(6n);
  });

  it('a single number', () => {
    expect(sum([5])).toBe(5);
  });

  it('a single bigint', () => {
    expect(sum([5n])).toBe(5n);
  });

  it('-0 sums to 0', () => {
    expect(sum([-0])).toBe(0);
  });

  it('propagates NaN', () => {
    expect(sum([1, NaN, 3])).toBeNaN();
  });

  it('throws on a number after bigints', () => {
    // @ts-expect-error [ts2345] -- The types reject mixing bigint and number.
    expect(() => sum([1n, 2])).toThrow(
      new TypeError(
        'Cannot mix BigInt and other types, use explicit conversions',
      ),
    );
  });

  it('throws on a bigint after numbers', () => {
    // @ts-expect-error [ts2345] -- The types reject mixing bigint and number.
    expect(() => sum([1, 2n])).toThrow(
      new TypeError(
        'Cannot mix BigInt and other types, use explicit conversions',
      ),
    );
  });

  it('throws on the first item of the other type', () => {
    const data = [1n, 2n, 3];
    // Reading past the item that mixes the types throws a different error.
    Object.defineProperty(data, 3, {
      get: () => {
        throw new Error('Read past the mixed item');
      },
    });

    // @ts-expect-error [ts2345] -- The types reject mixing bigint and number.
    expect(() => sum(data)).toThrow(
      new TypeError(
        'Cannot mix BigInt and other types, use explicit conversions',
      ),
    );
  });
});

describe('dataLast', () => {
  it('should return the sum of numbers in an array', () => {
    expect(pipe([1, 2, 3], sum())).toBe(6);
    expect(pipe([4, 5, 6], sum())).toBe(15);
    expect(pipe([-1, 0, 1], sum())).toBe(0);
  });

  it('should return 0 for an empty array', () => {
    expect(pipe([], sum())).toBe(0);
  });

  it('throws like data-first on mixed bigint and number', () => {
    // @ts-expect-error [ts2345] -- The types reject mixing bigint and number.
    expect(() => pipe([1n, 2], sum())).toThrow(
      new TypeError(
        'Cannot mix BigInt and other types, use explicit conversions',
      ),
    );
  });
});

describe('known issues!', () => {
  it('returns 0 (`number`) instead of 0n (`bigint`) for empty `bigint` arrays', () => {
    const result = sum([] as Array<bigint>);

    expect(result).toBe(0);
  });
});
