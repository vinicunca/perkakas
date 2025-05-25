import { take } from './take';
import { pipe } from './pipe';
import { identity } from './identity';
import { map } from './map';
import { describe, it, expect, vi } from 'vitest';

describe('take function - unit tests', () => {
  describe('data first', () => {
    it('should return the first n elements of an array', () => {
      expect(take([1, 2, 3, 4, 5], 3)).toStrictEqual([1, 2, 3]);
    });

    it('should return an empty array when n is negative', () => {
      expect(take([1, 2, 3, 4, 5], -1)).toStrictEqual([]);
    });

    it('should return the entire array when n is greater than the array length', () => {
      expect(take([1, 2, 3], 10)).toStrictEqual([1, 2, 3]);
    });

    it('should return a shallow clone when n equals the array length', () => {
      const data = [1, 2, 3];
      const result = take(data, 3);
      expect(result).toStrictEqual([1, 2, 3]);
      expect(result).not.toBe(data);
    });
  });

  describe('data last', () => {
    it('should work with pipe to return the first n elements', () => {
      expect(pipe([1, 2, 3, 4, 5], take(2))).toStrictEqual([1, 2]);
    });

    it('should return an empty array when used with pipe and n is negative', () => {
      expect(pipe([1, 2, 3, 4, 5], take(-1))).toStrictEqual([]);
    });

    it('should return the entire array when used with pipe and n is greater than the array length', () => {
      expect(pipe([1, 2, 3], take(10))).toStrictEqual([1, 2, 3]);
    });

    it('should evaluate lazily when used with pipe and map', () => {
      const mockFunc = vi.fn(identity);
      pipe([1, 2, 3, 4, 5], map(mockFunc), take(2));
      expect(mockFunc).toHaveBeenCalledTimes(2);
    });
  });
});