import { describe, expect, it } from 'vitest';

import { floor } from './floor';

describe('data-first', () => {
  it('should work with positive precision', () => {
    expect(floor(8123.4317, 3)).toEqual(8123.431);
    expect(floor(483.22243, 1)).toEqual(483.2);
    expect(floor(123.4317, 5)).toEqual(123.4317);
  });

  it('should work with negative precision', () => {
    expect(floor(8123.4317, -2)).toEqual(8100);
    expect(floor(8123.4317, -4)).toEqual(0);
  });

  it('should work with precision = 0', () => {
    expect(floor(8123.4317, 0)).toEqual(8123);
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY])('should throw for %d precision', (val) => {
    expect(() => floor(1, val)).toThrowError(
      `precision must be an integer: ${val}`,
    );
  });

  it('should throw for non integer precision', () => {
    expect(() => floor(1, 21.37)).toThrowError(
      'precision must be an integer: 21.37',
    );
  });

  it('should throw for precision higher than 15 and lower than -15', () => {
    expect(() => floor(1, 16)).toThrowError(
      'precision must be between -15 and 15',
    );
    expect(() => floor(1, -16)).toThrowError(
      'precision must be between -15 and 15',
    );
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
    'should return %d when passed as value regardless of precision',
    (val) => {
      for (const precision of [-1, 0, 1]) {
        expect(floor(val, precision)).toStrictEqual(val);
      }
    },
  );
});

describe('data-last', () => {
  it('should work with positive precision', () => {
    expect(floor(3)(8123.4317)).toEqual(8123.431);
    expect(floor(1)(483.22243)).toEqual(483.2);
    expect(floor(5)(123.4317)).toEqual(123.4317);
  });

  it('should work with negative precision', () => {
    expect(floor(-2)(8123.4317)).toEqual(8100);
    expect(floor(-4)(8123.4317)).toEqual(0);
  });

  it('should work with precision = 0', () => {
    expect(floor(0)(8123.4317)).toEqual(8123);
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY])('should throw for %d precision', (val) => {
    expect(() => floor(val)(1)).toThrowError(
      `precision must be an integer: ${val}`,
    );
  });

  it('should throw for non integer precision', () => {
    expect(() => floor(21.37)(1)).toThrowError(
      'precision must be an integer: 21.37',
    );
  });

  it('should throw for precision higher than 15 and lower than -15', () => {
    expect(() => floor(16)(1)).toThrowError(
      'precision must be between -15 and 15',
    );
    expect(() => floor(-16)(1)).toThrowError(
      'precision must be between -15 and 15',
    );
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
    'should return %d when passed as value regardless of precision',
    (val) => {
      for (const precision of [-1, 0, 1]) {
        expect(floor(precision)(val)).toStrictEqual(val);
      }
    },
  );
});
