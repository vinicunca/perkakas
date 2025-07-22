import { describe, expect, it } from 'vitest';
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
});
