import { describe, expect, it, vi } from 'vitest';
import { constant } from './constant';
import { findLast } from './find-last';
import { pipe } from './pipe';

describe('data first', () => {
  it('findLast', () => {
    expect(findLast([1, 2, 3, 4], (x) => x % 2 === 1)).toBe(3);
  });

  it('indexed', () => {
    expect(findLast([1, 2, 3, 4], (x, i) => x === 3 && i === 2)).toBe(3);
  });

  it('findLast first value', () => {
    expect(findLast([1, 2, 3, 4], (x) => x === 1)).toBe(1);
  });

  it('findLast no match', () => {
    expect(findLast([1, 2, 3, 4], (x) => x === 5)).toBeUndefined();
  });

  it('returns undefined for an empty array', () => {
    expect(findLast([], constant(true))).toBeUndefined();
  });

  it('doesn\'t call the predicate on an empty array', () => {
    const predicate = vi.fn<(value: number) => boolean>();

    findLast([], predicate);

    expect(predicate).not.toHaveBeenCalled();
  });

  it('a single item', () => {
    expect(findLast([5], constant(true))).toBe(5);
  });

  it('scans backward and stops at the first match', () => {
    const data = [1, 2, 3, 4];
    const predicate = vi.fn<
      (value: number, index: number, data: ReadonlyArray<number>) => boolean
    >((value) => value === 2);

    findLast(data, predicate);

    expect(predicate.mock.calls).toStrictEqual([
      [4, 3, data],
      [3, 2, data],
      [2, 1, data],
    ]);
  });

  it('scans every item backward when nothing matches', () => {
    const data = [1, 2, 3];
    const predicate = vi.fn<
      (value: number, index: number, data: ReadonlyArray<number>) => boolean
    >(constant(false));

    findLast(data, predicate);

    expect(predicate.mock.calls).toStrictEqual([
      [3, 2, data],
      [2, 1, data],
      [1, 0, data],
    ]);
  });

  it('returns the last of same-shape matches by reference', () => {
    const second = { id: 0 };

    expect(findLast([
      { id: 0 },
      second,
    ], constant(true))).toBe(second);
  });

  it('returns -0 when it is the last match', () => {
    expect(findLast([0, -0], (value) => value === 0)).toBe(-0);
  });
});

describe('data last', () => {
  it('findLast', () => {
    expect(
      pipe(
        [1, 2, 3, 4],
        findLast((x) => x % 2 === 1),
      ),
    ).toBe(3);
  });

  it('indexed', () => {
    expect(
      pipe(
        [1, 2, 3, 4],
        findLast((x, i) => x === 3 && i === 2),
      ),
    ).toBe(3);
  });

  it('returns undefined for an empty array', () => {
    expect(pipe([], findLast(constant(true)))).toBeUndefined();
  });
});
