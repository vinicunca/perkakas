import { describe, expect, it } from 'vitest';
import { sortedLastIndex } from './sorted-last-index';

it('empty array', () => {
  expect(sortedLastIndex([], 1)).toBe(0);
});

describe('array with single item', () => {
  it('item smaller than item in array', () => {
    expect(sortedLastIndex([2], 1)).toBe(0);
  });

  it('item larger than item in array', () => {
    expect(sortedLastIndex([0], 1)).toBe(1);
  });

  it('item in array', () => {
    expect(sortedLastIndex([1], 1)).toBe(1);
  });
});

describe('array with multiple values', () => {
  it('item smaller than all items in array', () => {
    expect(sortedLastIndex([1, 2, 3, 4, 5], 0)).toBe(0);
  });

  it('item larger than all items in array', () => {
    expect(sortedLastIndex([1, 2, 3, 4, 5], 6)).toBe(5);
  });

  it('item in array', () => {
    expect(sortedLastIndex([1, 2, 3, 4, 5], 3)).toBe(3);
  });
});

describe('array with duplicates', () => {
  it('item smaller than all items in array', () => {
    expect(sortedLastIndex([1, 1, 1, 1, 1], 0)).toBe(0);
  });

  it('item larger than all items in array', () => {
    expect(sortedLastIndex([1, 1, 1, 1, 1], 2)).toBe(5);
  });

  it('item in array', () => {
    expect(sortedLastIndex([1, 1, 1, 1, 1], 1)).toBe(5);
  });
});

describe('string array', () => {
  it('item smaller than all items in array', () => {
    expect(sortedLastIndex(['a', 'b', 'c', 'd', 'e'], ' ')).toBe(0);
  });

  it('item larger than all items in array', () => {
    expect(sortedLastIndex(['a', 'b', 'c', 'd', 'e'], 'z')).toBe(5);
  });

  it('item in array', () => {
    expect(sortedLastIndex(['a', 'b', 'c', 'd', 'e'], 'c')).toBe(3);
  });
});
