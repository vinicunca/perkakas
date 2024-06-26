import { round } from './round';

describe('data-first', () => {
  it('should work with positive precision', () => {
    expect(round(8123.4317, 3)).toEqual(8123.432);
    expect(round(483.222_43, 1)).toEqual(483.2);
    expect(round(123.4317, 5)).toEqual(123.4317);
  });

  it('should work with negative precision', () => {
    expect(round(8123.4317, -2)).toEqual(8100);
    expect(round(8123.4317, -4)).toEqual(10_000);
  });

  it('should work with precision = 0', () => {
    expect(round(8123.4317, 0)).toEqual(8123);
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY])(
    'should throw for %d precision',
    (val) => {
      expect(() => round(1, val)).toThrowError(
        `precision must be an integer: ${val}`,
      );
    },
  );

  it('should throw for non integer precision', () => {
    expect(() => round(1, 21.37)).toThrowError(
      'precision must be an integer: 21.37',
    );
  });

  it('should throw for precision higher than 15 and lower than -15', () => {
    expect(() => round(1, 16)).toThrowError(
      'precision must be between -15 and 15',
    );
    expect(() => round(1, -16)).toThrowError(
      'precision must be between -15 and 15',
    );
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
    'should return %d when passed as value regardless of precision',
    (val) => {
      for (const precision of [-1, 0, 1]) {
        expect(round(val, precision)).toStrictEqual(val);
      }
    },
  );
});

describe('data-last', () => {
  it('should work with positive precision', () => {
    expect(round(3)(8123.4317)).toEqual(8123.432);
    expect(round(1)(483.222_43)).toEqual(483.2);
    expect(round(5)(123.4317)).toEqual(123.4317);
  });

  it('should work with negative precision', () => {
    expect(round(-2)(8123.4317)).toEqual(8100);
    expect(round(-4)(8123.4317)).toEqual(10_000);
  });

  it('should work with precision = 0', () => {
    expect(round(0)(8123.4317)).toEqual(8123);
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY])(
    'should throw for %d precision',
    (val) => {
      expect(() => round(val)(1)).toThrowError(
        `precision must be an integer: ${val}`,
      );
    },
  );

  it('should throw for non integer precision', () => {
    expect(() => round(21.37)(1)).toThrowError(
      'precision must be an integer: 21.37',
    );
  });

  it('should throw for precision higher than 15 and lower than -15', () => {
    expect(() => round(16)(1)).toThrowError(
      'precision must be between -15 and 15',
    );
    expect(() => round(-16)(1)).toThrowError(
      'precision must be between -15 and 15',
    );
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
    'should return %d when passed as value regardless of precision',
    (val) => {
      for (const precision of [-1, 0, 1]) {
        expect(round(precision)(val)).toStrictEqual(val);
      }
    },
  );
});
