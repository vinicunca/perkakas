import { describe, expect, it, vi } from 'vitest';
import { first } from './first';
import { identity } from './identity';
import { map } from './map';
import { pipe } from './pipe';
import { zip } from './zip';

describe('dataFirst', () => {
  it('should zip', () => {
    expect(zip([1, 2, 3], ['a', 'b', 'c'])).toStrictEqual([
      [1, 'a'],
      [2, 'b'],
      [3, 'c'],
    ]);
  });

  it('should truncate to shorter second', () => {
    expect(zip([1, 2, 3], ['a', 'b'])).toStrictEqual([
      [1, 'a'],
      [2, 'b'],
    ]);
  });

  it('should truncate to shorter first', () => {
    expect(zip([1, 2], ['a', 'b', 'c'])).toStrictEqual([
      [1, 'a'],
      [2, 'b'],
    ]);
  });
});

describe('dataLast', () => {
  it('should zip', () => {
    expect(pipe([1, 2, 3], zip(['a', 'b', 'c']))).toStrictEqual([
      [1, 'a'],
      [2, 'b'],
      [3, 'c'],
    ]);
  });

  it('should truncate to shorter second', () => {
    expect(pipe([1, 2, 3], zip(['a', 'b']))).toStrictEqual([
      [1, 'a'],
      [2, 'b'],
    ]);
  });

  it('should truncate to shorter first', () => {
    expect(pipe([1, 2], zip(['a', 'b', 'c']))).toStrictEqual([
      [1, 'a'],
      [2, 'b'],
    ]);
  });

  it('evaluates lazily', () => {
    const mockFn = vi.fn(identity());
    pipe([1, 2, 3], map(mockFn), zip([4, 5, 6]), first());
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
