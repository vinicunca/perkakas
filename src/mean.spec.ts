import { describe, expect, it } from 'vitest';
import { mean } from './mean';
import { pipe } from './pipe';

describe('dataFirst', () => {
  it('should return the mean of numbers in an array', () => {
    expect(mean([1, 2, 3])).toBe(2);
    expect(mean([4, 5, 6])).toBe(5);
    expect(mean([-1, 0, 1])).toBe(0);
  });

  it('should return undefined for an empty array', () => {
    expect(mean([])).toBeUndefined();
  });

  it('a single item', () => {
    expect(mean([5])).toBe(5);
  });

  it('-0 averages to 0', () => {
    expect(mean([-0])).toBe(0);
  });

  it('propagates NaN', () => {
    expect(mean([1, NaN, 3])).toBeNaN();
  });
});

describe('dataLast', () => {
  it('should return the mean of numbers in an array', () => {
    expect(pipe([1, 2, 3], mean())).toBe(2);
    expect(pipe([4, 5, 6], mean())).toBe(5);
    expect(pipe([-1, 0, 1], mean())).toBe(0);
  });

  it('should return undefined for an empty array', () => {
    expect(pipe([], mean())).toBeUndefined();
  });
});
