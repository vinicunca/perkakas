import { describe, expect, it } from 'vitest';

import { range } from './range';

describe('data first', () => {
  it('range', () => {
    expect(range(1, 5)).toEqual([1, 2, 3, 4]);
  });
});

describe('data last', () => {
  it('range', () => {
    expect(range(5)(1)).toEqual([1, 2, 3, 4]);
  });
});
