import { describe, expect, it } from 'vitest';

import { sortedIndex } from './sorted-index';

describe('runtime correctness', () => {
  it('empty array', () => {
    expect(sortedIndex([], 1)).toBe(0);
  });

  describe('array with single item', () => {
    it('item smaller than item in array', () => {
      expect(sortedIndex([2], 1)).toBe(0);
    });

    it('item larger than item in array', () => {
      expect(sortedIndex([0], 1)).toBe(1);
    });

    it('item in array', () => {
      expect(sortedIndex([1], 1)).toBe(0);
    });
  });

  describe('array with multiple values', () => {
    it('item smaller than all items in array', () => {
      expect(sortedIndex([1, 2, 3, 4, 5], 0)).toBe(0);
    });

    it('item larger than all items in array', () => {
      expect(sortedIndex([1, 2, 3, 4, 5], 6)).toBe(5);
    });

    it('item in array', () => {
      expect(sortedIndex([1, 2, 3, 4, 5], 3)).toBe(2);
    });
  });

  describe('array with duplicates', () => {
    it('item smaller than all items in array', () => {
      expect(sortedIndex([1, 1, 1, 1, 1], 0)).toBe(0);
    });

    it('item larger than all items in array', () => {
      expect(sortedIndex([1, 1, 1, 1, 1], 2)).toBe(5);
    });

    it('item in array', () => {
      expect(sortedIndex([1, 1, 1, 1, 1], 1)).toBe(0);
    });
  });

  describe('string array', () => {
    it('item smaller than all items in array', () => {
      expect(sortedIndex(['a', 'b', 'c', 'd', 'e'], ' ')).toBe(0);
    });

    it('item larger than all items in array', () => {
      expect(sortedIndex(['a', 'b', 'c', 'd', 'e'], 'z')).toBe(5);
    });

    it('item in array', () => {
      expect(sortedIndex(['a', 'b', 'c', 'd', 'e'], 'c')).toBe(2);
    });
  });
});
