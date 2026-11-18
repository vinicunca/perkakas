import { describe, expect, it, vi } from 'vitest';
import { identity } from './identity';
import { pipe } from './pipe';
import { prop } from './prop';
import { sumBy } from './sum-by';

describe('data first', () => {
  it('sumBy', () => {
    expect(
      sumBy([
        { a: 1 },
        { a: 2 },
        { a: 4 },
        { a: 5 },
        { a: 3 },
      ], prop('a')),
    ).toBe(15);
  });

  it('indexed', () => {
    expect(
      sumBy(
        [
          { a: 1 },
          { a: 2 },
          { a: 4 },
          { a: 5 },
          { a: 3 },
        ],
        ({ a }, idx) => a + idx,
      ),
    ).toBe(25);
  });

  it('works with bigint', () => {
    expect(
      sumBy([
        { a: 1n },
        { a: 2n },
        { a: 4n },
        { a: 5n },
        { a: 3n },
      ], prop('a')),
    ).toBe(15n);
  });

  it('should return 0 for an empty array', () => {
    expect(sumBy([], prop('a'))).toBe(0);
  });

  it('a single item', () => {
    expect(sumBy([
      { a: 5 },
    ], prop('a'))).toBe(5);
  });

  it('a single bigint', () => {
    expect(sumBy([
      { a: 5n },
    ], prop('a'))).toBe(5n);
  });

  it('keeps -0 from the first mapped value', () => {
    expect(sumBy([-0, -0], identity())).toBe(-0);
  });

  it('propagates NaN', () => {
    expect(sumBy([1, NaN, 3], identity())).toBeNaN();
  });

  it('calls the mapper on each item in order with the whole array', () => {
    const data = [1, 2, 3];
    const mapper
      = vi.fn<(value: number, index: number, data: ReadonlyArray<number>) => number>(
        identity(),
      );

    sumBy(data, mapper);

    expect(mapper.mock.calls).toStrictEqual([
      [1, 0, data],
      [2, 1, data],
      [3, 2, data],
    ]);
  });

  it('doesn\'t call the mapper on an empty array', () => {
    const mapper = vi.fn<(value: number) => number>(identity());

    sumBy([], mapper);

    expect(mapper).not.toHaveBeenCalled();
  });

  it('throws on a number after bigints', () => {
    // @ts-expect-error [ts2769] -- The types reject a mapper that mixes bigint and number.
    expect(() => sumBy([1n, 2], identity())).toThrow(
      new TypeError(
        'Cannot mix BigInt and other types, use explicit conversions',
      ),
    );
  });

  it('throws on a bigint after numbers', () => {
    // @ts-expect-error [ts2769] -- The types reject a mapper that mixes bigint and number.
    expect(() => sumBy([1, 2n], identity())).toThrow(
      new TypeError(
        'Cannot mix BigInt and other types, use explicit conversions',
      ),
    );
  });

  it('stops mapping at the first value of the other type', () => {
    const mapper
      = vi.fn<(value: bigint | number) => bigint | number>(identity());

    // @ts-expect-error [ts2769] -- The types reject a mapper that mixes bigint and number.
    expect(() => sumBy([1n, 2, 3n], mapper)).toThrow(
      new TypeError(
        'Cannot mix BigInt and other types, use explicit conversions',
      ),
    );
    expect(mapper).toHaveBeenCalledTimes(2);
  });
});

describe('data last', () => {
  it('sumBy', () => {
    expect(
      pipe(
        [
          { a: 1 },
          { a: 2 },
          { a: 4 },
          { a: 5 },
          { a: 3 },
        ],
        sumBy(prop('a')),
      ),
    ).toBe(15);
  });

  it('works with bigint', () => {
    expect(
      pipe(
        [
          { a: 1n },
          { a: 2n },
          { a: 4n },
          { a: 5n },
          { a: 3n },
        ],
        sumBy(prop('a')),
      ),
    ).toBe(15n);
  });

  it('should return 0 for an empty array', () => {
    expect(pipe([], sumBy(prop('a')))).toBe(0);
  });

  it('indexed', () => {
    const actual = pipe(
      [
        { a: 1 },
        { a: 2 },
        { a: 4 },
        { a: 5 },
        { a: 3 },
      ],
      sumBy(({ a }, idx) => a + idx),
    );

    expect(actual).toBe(25);
  });

  it('throws like data-first on mixed bigint and number', () => {
    // @ts-expect-error [ts2769] -- The types reject a mapper that mixes bigint and number.
    expect(() => pipe([1n, 2], sumBy(identity()))).toThrow(
      new TypeError(
        'Cannot mix BigInt and other types, use explicit conversions',
      ),
    );
  });
});
