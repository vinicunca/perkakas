import { describe, expect, it } from 'vitest';

import { pipe } from '../function/pipe';
import { findLastIndex } from './find-last-index';

const array = [1, 2, 3, 4];

describe('data first', () => {
  it('findLastIndex', () => {
    expect(findLastIndex(array, (x) => x % 2 === 1)).toBe(2);
  });

  it('findLastIndex.indexed', () => {
    expect(findLastIndex.indexed(array, (x) => x % 2 === 1)).toBe(2);
  });

  it('findLast first value', () => {
    expect(findLastIndex(array, (x) => x === 1)).toEqual(0);
  });

  it('findLastIndex -1', () => {
    expect(findLastIndex(array, (x) => x === 5)).toBe(-1);
  });
});

describe('data last', () => {
  it('findLastIndex', () => {
    expect(
      pipe(
        array,
        findLastIndex((x) => x % 2 === 1),
      ),
    ).toEqual(2);
  });

  it('findLastIndex.indexed', () => {
    expect(
      pipe(
        array,
        findLastIndex.indexed((x) => x % 2 === 1),
      ),
    ).toEqual(2);
  });
});
