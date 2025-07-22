import { describe, expect, it } from 'vitest';
import { anyPass } from './any-pass';

const fns = [(x: number) => x === 3, (x: number) => x === 4] as const;

describe('data first', () => {
  it('anyPass', () => {
    expect(anyPass(3, fns)).toBe(true);
    expect(anyPass(4, fns)).toBe(true);
    expect(anyPass(1, fns)).toBe(false);
  });
});

describe('data last', () => {
  it('anyPass', () => {
    expect(anyPass(fns)(3)).toBe(true);
    expect(anyPass(fns)(4)).toBe(true);
    expect(anyPass(fns)(1)).toBe(false);
  });
});
