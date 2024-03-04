import { describe, expect, it } from 'vitest';

import { splitAt } from './split-at';

describe('data_first', () => {
  it('split', () => {
    expect(splitAt([1, 2, 3] as const, 1)).toEqual([[1], [2, 3]]);
  });

  it('split at -1', () => {
    expect(splitAt([1, 2, 3, 4, 5] as const, -1)).toEqual([[1, 2, 3, 4], [5]]);
  });
});

describe('data_last', () => {
  it('split', () => {
    expect(splitAt(1)([1, 2, 3] as const)).toEqual([[1], [2, 3]]);
  });

  it('split at -1', () => {
    expect(splitAt(-1)([1, 2, 3, 4, 5] as const)).toEqual([[1, 2, 3, 4], [5]]);
  });
});
