import { describe, expect, it } from 'vitest';

import { merge } from './merge';

const a = {
  x: 1,
  y: 2,
};

const b = {
  y: 10,
  z: 2,
};

describe('data first', () => {
  it('should merge', () => {
    expect(merge(a, b)).toEqual({ x: 1, y: 10, z: 2 });
  });
});

describe('data last', () => {
  it('should merge', () => {
    expect(merge(b)(a)).toEqual({ x: 1, y: 10, z: 2 });
  });
});
