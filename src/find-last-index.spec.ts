import { describe, expect, it, vi } from 'vitest';
import { constant } from './constant';
import { findLastIndex } from './find-last-index';
import { pipe } from './pipe';

describe('data first', () => {
  it('findLastIndex', () => {
    expect(findLastIndex([1, 2, 3, 4], (x) => x % 2 === 1)).toBe(2);
  });

  it('findLast first value', () => {
    expect(findLastIndex([1, 2, 3, 4], (x) => x === 1)).toBe(0);
  });

  it('findLastIndex -1', () => {
    expect(findLastIndex([1, 2, 3, 4], (x) => x === 5)).toBe(-1);
  });

  it('returns -1 for an empty array', () => {
    expect(findLastIndex([], constant(true))).toBe(-1);
  });

  it('doesn\'t call the predicate on an empty array', () => {
    const predicate = vi.fn<(value: number) => boolean>();

    findLastIndex([], predicate);

    expect(predicate).not.toHaveBeenCalled();
  });

  it('a single item', () => {
    expect(findLastIndex([5], constant(true))).toBe(0);
  });

  it('scans backward and stops at the first match', () => {
    const data = [1, 2, 3, 4];
    const predicate = vi.fn<
      (value: number, index: number, data: ReadonlyArray<number>) => boolean
    >((value) => value === 2);

    findLastIndex(data, predicate);

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

    findLastIndex(data, predicate);

    expect(predicate.mock.calls).toStrictEqual([
      [3, 2, data],
      [2, 1, data],
      [1, 0, data],
    ]);
  });

  it('reads holes as undefined', () => {
    // eslint-disable-next-line no-sparse-arrays -- The hole is the case under test.
    expect(findLastIndex([1, , 3], (value) => value === undefined)).toBe(1);
  });
});

describe('data last', () => {
  it('found', () => {
    expect(
      pipe(
        [1, 2, 3, 4],
        findLastIndex((x) => x % 2 === 1),
      ),
    ).toBe(2);
  });

  it('not found', () => {
    expect(
      pipe(
        [1, 2, 3, 4],
        findLastIndex((x) => x === 5),
      ),
    ).toBe(-1);
  });

  it('returns -1 for an empty array', () => {
    expect(pipe([], findLastIndex(constant(true)))).toBe(-1);
  });
});
