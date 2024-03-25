import { describe, expect, it } from 'vitest';

import { pipe } from '../pipe';
import { concat } from './concat';

describe('data first', () => {
  it('concat', () => {
    const actual = concat([1, 2, 3] as const, ['a'] as const);
    expect(actual).toEqual([1, 2, 3, 'a'] as const);
  });
});

describe('data last', () => {
  it('concat', () => {
    const actual = pipe([1, 2, 3] as const, concat(['a'] as const));
    expect(actual).toEqual([1, 2, 3, 'a']);
  });
});
