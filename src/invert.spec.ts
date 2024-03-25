import { describe, expect, it } from 'vitest';

import { invert } from './invert';
import { pipe } from './pipe';

describe('data first', () => {
  it('empty object', () => {
    expect(invert({})).toEqual({});
  });

  it('no duplicate values', () => {
    expect(invert({ a: 'd', b: 'e', c: 'f' })).toEqual({
      d: 'a',
      e: 'b',
      f: 'c',
    });
  });

  it('duplicate values', () => {
    expect(invert({ a: 'd', b: 'e', c: 'd' })).toEqual({ d: 'c', e: 'b' });
  });

  it('numeric values', () => {
    expect(invert(['a', 'b', 'c'])).toEqual({ a: '0', b: '1', c: '2' });
  });
});

describe('data last', () => {
  it('empty object', () => {
    expect(pipe({}, invert())).toEqual({});
  });

  it('no duplicate values', () => {
    expect(pipe({ a: 'd', b: 'e', c: 'f' }, invert())).toEqual({
      d: 'a',
      e: 'b',
      f: 'c',
    });
  });

  it('duplicate values', () => {
    expect(pipe({ a: 'd', b: 'e', c: 'd' }, invert())).toEqual({
      d: 'c',
      e: 'b',
    });
  });

  it('numeric values', () => {
    expect(pipe(['a', 'b', 'c'], invert())).toEqual({
      a: '0',
      b: '1',
      c: '2',
    });
  });
});
