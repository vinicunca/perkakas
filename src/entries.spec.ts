import { describe, expect, expectTypeOf, it } from 'vitest';

import { entries } from './entries';

describe('runtime', () => {
  it('dataFirst', () => {
    expect(entries({ a: 1, b: 2, c: 3 })).toEqual([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);
  });

  describe('typing', () => {
    it('with known properties', () => {
      const actual = entries({ a: 1, b: 2, c: 3 });
      expectTypeOf(actual).toEqualTypeOf<Array<[string, number]>>();
    });

    it('with optional properties', () => {
      const actual = entries({} as { a?: string });
      expectTypeOf(actual).toEqualTypeOf<Array<[string, string]>>();
    });

    it('with undefined properties', () => {
      const actual = entries({ a: undefined } as {
        a: string | undefined;
      });
      expectTypeOf(actual).toEqualTypeOf<Array<[string, string | undefined]>>();
    });

    it('with unknown properties', () => {
      const actual = entries({} as Record<string, unknown>);
      expectTypeOf(actual).toEqualTypeOf<Array<[string, unknown]>>();
    });
  });
});

describe('entries.strict', () => {
  it('should return pairs', () => {
    const actual = entries.strict({ a: 1, b: 2, c: 3 });
    expect(actual).toEqual([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);
  });

  describe('typing', () => {
    it('with known properties', () => {
      const actual = entries.strict({ a: 1, b: 2, c: 3 } as const);
      expectTypeOf(actual).toEqualTypeOf<
        Array<['a', 1] | ['b', 2] | ['c', 3]>
      >();
    });

    it('with optional properties', () => {
      const actual = entries.strict({} as { a?: string });
      expectTypeOf(actual).toEqualTypeOf<Array<['a', string]>>();
    });

    it('with undefined properties', () => {
      const actual = entries.strict({ a: undefined } as {
        a: string | undefined;
      });
      expectTypeOf(actual).toEqualTypeOf<Array<['a', string | undefined]>>();
    });

    it('with unknown properties', () => {
      const actual = entries.strict({} as Record<string, unknown>);
      expectTypeOf(actual).toEqualTypeOf<Array<[string, unknown]>>();
    });
  });
});
