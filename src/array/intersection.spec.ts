import { describe, expect, it } from 'vitest';

import { intersection } from './intersection';

describe('data_first', () => {
  it('intersection', () => {
    expect(intersection([1, 2, 3] as const, [2, 3, 5] as const)).toEqual([
      2,
      3,
    ]);
  });
});

describe('data_last', () => {
  it('intersection', () => {
    expect(intersection([2, 3, 5] as const)([1, 2, 3] as const)).toEqual([
      2,
      3,
    ]);
  });
});
