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
});

describe('data last', () => {
  it('should return last', () => {
    expect(pipe([1, 2, 3], last())).toBe(3);
  });

  it('empty array', () => {
    expect(pipe([], last())).toBeUndefined();
  });
});
