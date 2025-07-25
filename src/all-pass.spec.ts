import { describe, expect, it } from 'vitest';
import { allPass } from './all-pass';

const fns = [(x: number) => x % 3 === 0, (x: number) => x % 4 === 0] as const;

describe('data first', () => {
  it('allPass', () => {
    expect(allPass(12, fns)).toBe(true);
    expect(allPass(4, fns)).toBe(false);
    expect(allPass(3, fns)).toBe(false);
  });
});

describe('data last', () => {
  it('allPass', () => {
    expect(allPass(fns)(12)).toBe(true);
    expect(allPass(fns)(4)).toBe(false);
    expect(allPass(fns)(3)).toBe(false);
  });
});
