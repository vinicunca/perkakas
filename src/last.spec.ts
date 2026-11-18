import { describe, expect, it } from 'vitest';
import { last } from './last';
import { pipe } from './pipe';

describe('data first', () => {
  it('should return last', () => {
    expect(last([1, 2, 3])).toBe(3);
  });

  it('empty array', () => {
    expect(last([])).toBeUndefined();
  });

  it('a single item', () => {
    expect(last([5])).toBe(5);
  });

  it('returns the last of same-shape objects by reference', () => {
    const second = { id: 0 };

    expect(last([
      { id: 0 },
      second,
    ])).toBe(second);
  });

  it('reads a trailing hole as undefined', () => {
    // eslint-disable-next-line no-sparse-arrays -- The hole is the case under test.
    expect(last([1, ,])).toBeUndefined();
  });

  it('keeps -0', () => {
    expect(last([1, -0])).toBe(-0);
  });

  it('returns a trailing NaN', () => {
    expect(last([1, NaN])).toBeNaN();
  });
});

describe('data last', () => {
  it('should return last', () => {
    expect(pipe([1, 2, 3], last())).toBe(3);
  });

  it('empty array', () => {
    expect(pipe([], last())).toBeUndefined();
  });
});
