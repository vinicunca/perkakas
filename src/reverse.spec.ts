import { describe, expect, it } from 'vitest';
import { pipe } from './pipe';
import { reverse } from './reverse';

describe('data first', () => {
  it('reverse', () => {
    const actual = reverse([1, 2, 3]);

    expect(actual).toStrictEqual([3, 2, 1]);
  });
});

describe('data last', () => {
  it('reverse', () => {
    const actual = pipe([1, 2, 3], reverse());

    expect(actual).toStrictEqual([3, 2, 1]);
  });
});
