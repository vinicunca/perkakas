import { describe, expect, it } from 'vitest';
import { filter } from './filter';
import { hasAtLeast } from './has-at-least';
import { pipe } from './pipe';

describe('dataFirst', () => {
  it('works on empty arrays', () => {
    expect(hasAtLeast([], 0)).toBe(true);
    expect(hasAtLeast([], 10)).toBe(false);
  });

  it('works on single item arrays', () => {
    expect(hasAtLeast([1], 0)).toBe(true);
    expect(hasAtLeast([1], 1)).toBe(true);
    expect(hasAtLeast([1], 2)).toBe(false);
  });

  it('works on large arrays', () => {
    const array = Array.from({ length: 1000 }, (_, i) => i);

    expect(hasAtLeast(array, 0)).toBe(true);
    expect(hasAtLeast(array, 1)).toBe(true);
    expect(hasAtLeast(array, 1000)).toBe(true);
    expect(hasAtLeast(array, 1001)).toBe(false);
  });

  it('a fractional minimum above the length', () => {
    expect(hasAtLeast([1, 2], 2.5)).toBe(false);
  });

  it('a fractional minimum below the length', () => {
    expect(hasAtLeast([1, 2, 3], 2.5)).toBe(true);
  });

  it('a NaN minimum is never met', () => {
    expect(hasAtLeast([1, 2, 3], NaN)).toBe(false);
  });

  it('a NaN minimum is never met, even on an empty array', () => {
    expect(hasAtLeast([], NaN)).toBe(false);
  });

  it('a negative minimum is met by an empty array', () => {
    expect(hasAtLeast([], -1)).toBe(true);
  });

  it('an infinite minimum is never met', () => {
    expect(hasAtLeast([1, 2, 3], Infinity)).toBe(false);
  });
});

describe('dataLast', () => {
  it('works on empty arrays', () => {
    expect(hasAtLeast(0)([])).toBe(true);
    expect(hasAtLeast(10)([])).toBe(false);
  });

  it('works on single item arrays', () => {
    expect(hasAtLeast(0)([1])).toBe(true);
    expect(hasAtLeast(1)([1])).toBe(true);
    expect(hasAtLeast(2)([1])).toBe(false);
  });

  it('works on large arrays', () => {
    const array = Array.from({ length: 1000 }, (_, i) => i);

    expect(hasAtLeast(0)(array)).toBe(true);
    expect(hasAtLeast(1)(array)).toBe(true);
    expect(hasAtLeast(1000)(array)).toBe(true);
    expect(hasAtLeast(1001)(array)).toBe(false);
  });

  describe('in a pipe', () => {
    it('a zero minimum is met by an empty array', () => {
      expect(pipe([], hasAtLeast(0))).toBe(true);
    });

    it('a positive minimum isn\'t met by an empty array', () => {
      expect(pipe([], hasAtLeast(1))).toBe(false);
    });

    it('a negative minimum is met by an empty array', () => {
      expect(pipe([], hasAtLeast(-1))).toBe(true);
    });

    it('a NaN minimum is never met, even on an empty array', () => {
      expect(pipe([], hasAtLeast(NaN))).toBe(false);
    });

    it('a NaN minimum is never met', () => {
      expect(pipe([1, 2, 3], hasAtLeast(NaN))).toBe(false);
    });

    it('a fractional minimum above the length', () => {
      expect(pipe([1, 2], hasAtLeast(2.5))).toBe(false);
    });

    it('a fractional minimum below the length', () => {
      expect(pipe([1, 2, 3], hasAtLeast(2.5))).toBe(true);
    });

    it('counts only the items that reach it', () => {
      expect(
        pipe(
          [1, 2, 3, 4],
          filter((x) => x % 2 === 0),
          hasAtLeast(3),
        ),
      ).toBe(false);
    });

    it('as a filter predicate', () => {
      expect(pipe([
        [1, 2],
        [3],
        [4, 5],
      ], filter(hasAtLeast(2)))).toStrictEqual([
        [1, 2],
        [4, 5],
      ]);
    });
  });
});
