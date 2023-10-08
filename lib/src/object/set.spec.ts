import { describe, expect, it } from 'vitest';
import { pipe } from '../function';
import { set } from './set';

describe('data first', () => {
  it('set', () => {
    expect(set({ a: 1 }, 'a', 2)).toEqual({ a: 2 });
  });
});

describe('data last', () => {
  it('set', () => {
    expect(pipe({ a: 1 }, set('a', 2))).toEqual({ a: 2 });
  });
});
