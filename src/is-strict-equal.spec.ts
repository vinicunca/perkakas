import { describe, expect, it } from 'vitest';
import { isStrictEqual } from './is-strict-equal';

describe('primitives', () => {
  it('undefined', () => {
    expect(isStrictEqual(undefined, undefined)).toBe(true);
  });

  it('null', () => {
    expect(isStrictEqual(null, null)).toBe(true);
  });

  it('string', () => {
    expect(isStrictEqual('a', 'a')).toBe(true);
    expect(isStrictEqual('a', 'b')).toBe(false);
  });

  it('number', () => {
    expect(isStrictEqual(1, 1)).toBe(true);
    expect(isStrictEqual(1, 2)).toBe(false);
  });

  it('boolean', () => {
    expect(isStrictEqual(true, true)).toBe(true);
    expect(isStrictEqual(true, false)).toBe(false);
  });

  it('bigint', () => {
    expect(isStrictEqual(1n, 1n)).toBe(true);
    expect(isStrictEqual(1n, 2n)).toBe(false);
  });
});

describe('objects', () => {
  it('arrays', () => {
    const data = [1, 2, 3];
    expect(isStrictEqual(data, [1, 2, 3])).toBe(false);
    expect(isStrictEqual(data, data)).toBe(true);
  });

  it('objects', () => {
    const data = { a: 1, b: 2 };
    expect(isStrictEqual(data, { a: 1, b: 2 })).toBe(false);
    expect(isStrictEqual(data, data)).toBe(true);
  });

  it('uint arrays', () => {
    const data = new Uint8Array([1, 2, 3]);
    expect(isStrictEqual(data, new Uint8Array([1, 2, 3]))).toBe(false);
    expect(isStrictEqual(data, data)).toBe(true);
  });

  it('maps', () => {
    const data = new Map([['a', 1]]);
    expect(isStrictEqual(data, new Map([['a', 1]]))).toBe(false);
    expect(isStrictEqual(data, data)).toBe(true);
  });

  it('sets', () => {
    const data = new Set([1, 2, 3]);
    expect(isStrictEqual(data, new Set([1, 2, 3]))).toBe(false);
    expect(isStrictEqual(data, data)).toBe(true);
  });
});

describe('built-ins', () => {
  it('regex', () => {
    const data = /a/u;
    expect(isStrictEqual(data, /a/u)).toBe(false);
    expect(isStrictEqual(data, data)).toBe(true);
  });

  it('dates', () => {
    const data = new Date();
    expect(isStrictEqual(data, new Date())).toBe(false);
    expect(isStrictEqual(data, data)).toBe(true);
  });

  it('promises', () => {
    const data = Promise.resolve(1);
    expect(isStrictEqual(data, Promise.resolve(1))).toBe(false);
    expect(isStrictEqual(data, data)).toBe(true);
  });
});

describe('special cases', () => {
  it('naN', () => {
    // eslint-disable-next-line unicorn/prefer-number-properties
    expect(isStrictEqual(NaN, NaN)).toBe(true);
    expect(isStrictEqual(Number.NaN, Number.NaN)).toBe(true);
  });

  it('-0', () => {
    expect(isStrictEqual(-0, 0)).toBe(true);
    expect(isStrictEqual(-0, -0)).toBe(true);
    expect(isStrictEqual(0, 0)).toBe(true);
  });

  it('fails on loose equality', () => {
    expect(isStrictEqual('' as unknown, 0)).toBe(false);
    expect(isStrictEqual('' as unknown, false)).toBe(false);
    expect(isStrictEqual(0 as unknown, false)).toBe(false);
    expect(isStrictEqual('' as unknown, null)).toBe(false);
    expect(isStrictEqual('' as unknown, undefined)).toBe(false);
    expect(isStrictEqual(0 as unknown, null)).toBe(false);
    expect(isStrictEqual(0 as unknown, undefined)).toBe(false);
    expect(isStrictEqual(false as unknown, null)).toBe(false);
    expect(isStrictEqual(false as unknown, undefined)).toBe(false);
  });
});
