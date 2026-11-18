import { describe, expect, it, vi } from 'vitest';
import { identity } from './identity';
import { pipe } from './pipe';
import { prop } from './prop';
import { rankBy } from './rank-by';

describe('runtime (dataFirst)', () => {
  it('works trivially with empty arrays', () => {
    expect(rankBy([], 1, identity)).toBe(0);
  });

  it('maintains the rank for items already in the array', () => {
    const data = [5, 1, 3] as const;
    const sorted = [...data].sort((a, b) => a - b);
    for (const [index, item] of sorted.entries()) {
      expect(rankBy(data, item, identity())).toBe(index);
    }
  });

  it('can rank items not in the array', () => {
    const data = [5, 1, 3] as const;

    expect(rankBy(data, 0, identity())).toBe(0);
    expect(rankBy(data, 2, identity())).toBe(1);
    expect(rankBy(data, 4, identity())).toBe(2);
  });

  it('finds items ranked at the end of the array', () => {
    const data = [5, 1, 3] as const;

    expect(rankBy(data, 6, identity())).toBe(3);
  });

  it('doesn\'t project anything for an empty array', () => {
    const projection = vi.fn<(value: number) => number>(identity());

    rankBy([], 1, projection);

    expect(projection).not.toHaveBeenCalled();
  });

  it('projects the item, then each element, in order', () => {
    const projection = vi.fn<(value: number) => number>(identity());

    rankBy([3, 1, 2], 2, projection);

    expect(projection.mock.calls).toStrictEqual([
      [2],
      [3],
      [2],
      [1],
      [2],
      [2],
    ]);
  });

  it('doesn\'t count ties', () => {
    expect(rankBy([1, 1, 1], 1, identity())).toBe(0);
  });

  it('-0 ties with 0', () => {
    expect(rankBy([-0], 0, identity())).toBe(0);
  });

  it('never counts a NaN element', () => {
    expect(rankBy([NaN, 1], 2, identity())).toBe(1);
  });

  it('ranks a NaN item first', () => {
    expect(rankBy([1, 2], NaN, identity())).toBe(0);
  });
});

describe('runtime (dataLast)', () => {
  it('works trivially with empty arrays', () => {
    expect(pipe([], rankBy({ a: 1 }, prop('a')))).toBe(0);
  });

  it('can rank items not in the array', () => {
    expect(
      pipe([
        { a: 5 },
        { a: 1 },
        { a: 3 },
      ], rankBy({ a: 2 }, prop('a'))),
    ).toBe(1);
  });
});

describe('known issues!', () => {
  it('a function `item` is read as an order rule', () => {
    const result = rankBy(
      [
        () => 'foo',
      ],
      () => 'bar',
      () => 0,
    );

    // The 2nd argument to `rankBy` represents an item in the array, but
    // because it is a function it is detected as a projection rule, which
    // causes our currying logic to fail to detect this as a data-first call.
    expect(result).not.toBe(0);

    // Actual
    expect(result).toBeTypeOf('function');
  });
});
