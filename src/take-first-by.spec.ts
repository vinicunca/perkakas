import { describe, expect, it, vi } from 'vitest';
import { identity } from './identity';
import { pipe } from './pipe';
import { takeFirstBy } from './take-first-by';

describe('runtime (dataFirst)', () => {
  it('works', () => {
    const data = [4, 5, 1, 6, 2, 3, 7];

    expect(takeFirstBy(data, 2, identity())).toStrictEqual([2, 1]);
  });

  it('handles empty arrays gracefully', () => {
    const data: Array<number> = [];

    expect(takeFirstBy(data, 1, identity())).toHaveLength(0);
  });

  it('handles negative numbers gracefully', () => {
    const data = [4, 5, 1, 6, 2, 3, 7];

    expect(takeFirstBy(data, -3, identity())).toHaveLength(0);
  });

  it('handles overflowing numbers gracefully', () => {
    const data = [4, 5, 1, 6, 2, 3, 7];

    expect(takeFirstBy(data, 100, identity())).toHaveLength(data.length);
  });

  it('clones the array when needed', () => {
    const data = [4, 5, 1, 6, 2, 3, 7];
    const result = takeFirstBy(data, 100, identity());

    expect(result).not.toBe(data);
    expect(result).toStrictEqual(data);
  });

  it('works with complex compare rules', () => {
    const data = [
      'a',
      'aaa',
      'bbbbb',
      'aa',
      'bb',
      'bbb',
      'bbbb',
      'aaaa',
      'b',
      'aaaaa',
    ];

    expect(takeFirstBy(data, 3, (x) => x.length, identity())).toStrictEqual([
      'aa',
      'b',
      'a',
    ]);
  });

  it('a single item', () => {
    expect(takeFirstBy([5], 1, identity())).toStrictEqual([5]);
  });

  it('returns the heap layout when taking fewer than all items', () => {
    expect(takeFirstBy([4, 5, 1, 6, 2, 3, 7], 4, identity())).toStrictEqual([
      4,
      3,
      1,
      2,
    ]);
  });

  it('keeps the input order when taking all items', () => {
    expect(takeFirstBy([3, 1, 2], 3, identity())).toStrictEqual([3, 1, 2]);
  });

  it('floors a fractional n', () => {
    expect(takeFirstBy([3, 1, 2, 5, 4], 2.5, identity())).toStrictEqual([2, 1]);
  });

  it('a fractional n past the length keeps the input order', () => {
    expect(takeFirstBy([3, 1, 2], 3.5, identity())).toStrictEqual([3, 1, 2]);
  });

  it('a fraction below 1 takes nothing', () => {
    expect(takeFirstBy([3, 1, 2], 0.5, identity())).toStrictEqual([]);
  });

  it('n is NaN', () => {
    expect(takeFirstBy([3, 1, 2], NaN, identity())).toStrictEqual([]);
  });

  it('n is Infinity', () => {
    expect(takeFirstBy([3, 1, 2], Infinity, identity())).toStrictEqual([
      3,
      1,
      2,
    ]);
  });

  it('projects while building the heap, then for each later item', () => {
    const projection = vi.fn<(value: number) => number>(identity());

    takeFirstBy([3, 1, 2, 5, 4], 2, projection);

    expect(projection.mock.calls).toStrictEqual([
      [3],
      [1],
      [2],
      [3],
      [2],
      [1],
      [5],
      [2],
      [4],
      [2],
    ]);
  });

  it('doesn\'t project when taking all items', () => {
    const projection = vi.fn<(value: number) => number>(identity());

    takeFirstBy([3, 1, 2], 3, projection);

    expect(projection).not.toHaveBeenCalled();
  });

  it('doesn\'t project for a NaN n', () => {
    const projection = vi.fn<(value: number) => number>(identity());

    takeFirstBy([3, 1, 2], NaN, projection);

    expect(projection).not.toHaveBeenCalled();
  });
});

describe('runtime (dataLast)', () => {
  it('works', () => {
    const data = [4, 5, 1, 6, 2, 3, 7];

    expect(
      pipe(
        data,
        takeFirstBy(2, (x) => x),
      ),
    ).toStrictEqual([2, 1]);
  });

  it('handles empty arrays gracefully', () => {
    const data: Array<number> = [];

    expect(
      pipe(
        data,
        takeFirstBy(1, (x) => x),
      ),
    ).toHaveLength(0);
  });

  it('handles negative numbers gracefully', () => {
    const data = [4, 5, 1, 6, 2, 3, 7];

    expect(
      pipe(
        data,
        takeFirstBy(-3, (x) => x),
      ),
    ).toHaveLength(0);
  });

  it('handles overflowing numbers gracefully', () => {
    const data = [4, 5, 1, 6, 2, 3, 7];

    expect(
      pipe(
        data,
        takeFirstBy(100, (x) => x),
      ),
    ).toHaveLength(data.length);
  });

  it('clones the array when needed', () => {
    const data = [4, 5, 1, 6, 2, 3, 7];
    const result = pipe(
      data,
      takeFirstBy(100, (x) => x),
    );

    expect(result).not.toBe(data);
    expect(result).toStrictEqual(data);
  });

  it('works with complex compare rules', () => {
    const data = [
      'a',
      'aaa',
      'bbbbb',
      'aa',
      'bb',
      'bbb',
      'bbbb',
      'aaaa',
      'b',
      'aaaaa',
    ];

    expect(
      pipe(
        data,
        takeFirstBy(
          3,
          (x) => x.length,
          (x) => x,
        ),
      ),
    ).toStrictEqual(['aa', 'b', 'a']);
  });
});
