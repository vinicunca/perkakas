/* eslint-disable sonar/no-all-duplicated-branches */
import { hasSubObject } from './has-sub-object';
import { pipe } from './pipe';

describe('data first', () => {
  it('works with empty sub-object', () => {
    expect(hasSubObject({ a: 1, b: 'b', c: 3 }, {})).toBe(true);
    expect(hasSubObject({}, {})).toBe(true);
  });

  it('works with primitives', () => {
    expect(hasSubObject({ a: 1, b: 'b', c: 3 }, { a: 1, b: 'b' })).toBe(true);
    expect(hasSubObject({ a: 1, b: 'c', c: 3 }, { a: 1, b: 'b' })).toBe(false);
    expect(hasSubObject({ a: 2, b: 'b', c: 3 }, { a: 1, b: 'b' })).toBe(false);
  });

  it('works with deep objects', () => {
    expect(hasSubObject({ a: { b: 1, c: 2 } }, { a: { b: 1, c: 2 } })).toBe(
      true,
    );
    expect(hasSubObject({ a: { b: 1, c: 2 } }, { a: { b: 1, c: 0 } })).toBe(
      false,
    );
  });

  it('checks for matching key', () => {
    const data = {} as { a?: undefined };
    expect(hasSubObject(data, { a: undefined })).toBe(false);
  });
});

describe('data last', () => {
  it('works with empty sub-object', () => {
    expect(pipe({ a: 1, b: 2, c: 3 }, hasSubObject({}))).toBe(true);
    expect(pipe({}, hasSubObject({}))).toBe(true);
  });

  it('works with primitives', () => {
    expect(pipe({ a: 1, b: 'b', c: 3 }, hasSubObject({ a: 1, b: 'b' }))).toBe(
      true,
    );
    expect(pipe({ a: 1, b: 'c', c: 3 }, hasSubObject({ a: 1, b: 'b' }))).toBe(
      false,
    );
    expect(pipe({ a: 2, b: 'b', c: 3 }, hasSubObject({ a: 1, b: 'b' }))).toBe(
      false,
    );
  });

  it('works with deep objects', () => {
    expect(
      pipe({ a: { b: 1, c: 2 } }, hasSubObject({ a: { b: 1, c: 2 } })),
    ).toBe(true);

    expect(
      pipe({ a: { b: 1, c: 2 } }, hasSubObject({ a: { b: 1, c: 3 } })),
    ).toBe(false);
  });
});

describe('typing', () => {
  describe('data-first', () => {
    it('must have matching keys and values', () => {
      expectTypeOf(hasSubObject({ a: 2 }, { a: 1 })).toEqualTypeOf<boolean>();

      // @ts-expect-error [ts2353] - missing a key
      hasSubObject({ b: 2 }, { a: 1 });

      // @ts-expect-error [ts2322] - different value type
      hasSubObject({ a: 'a' }, { a: 1 });

      // ok - wider value type
      hasSubObject({ a: 'a' } as { a: number | string }, { a: 1 });

      // @ts-expect-error [ts2345] - narrower value type
      hasSubObject({ a: 'a' }, { a: 1 } as { a: number | string });

      // ok - unknown data type
      hasSubObject({ a: 2 } as unknown, { a: 1 });

      // ok - const value
      hasSubObject({ a: 2 }, { a: 1 } as const);
    });

    it('allows nested objects', () => {
      // ok - nested object has extra keys
      hasSubObject({ a: { b: 4 } }, { a: { b: 1, c: 2 } });

      // @ts-expect-error [ts2741] - nested object has missing keys
      hasSubObject({ a: { b: 1, c: 2 } }, { a: { b: 1 } });

      // @ts-expect-error [ts2322] - nested object has wrong value types
      hasSubObject({ a: { b: 4, c: 'c' } }, { a: { b: 1, c: 2 } });
    });

    it('narrows with empty object', () => {
      const obj = {} as { a?: string; b?: number };

      if (hasSubObject(obj, {})) {
        expectTypeOf(obj).toMatchTypeOf<{ a?: string; b?: number }>();
      } else {
        expectTypeOf(obj).toMatchTypeOf<{ a?: string; b?: number }>();
      }
    });

    it('narrows with same object', () => {
      const obj = {} as { a?: string; b?: number };

      if (hasSubObject(obj, obj)) {
        expectTypeOf(obj).toMatchTypeOf<{ a?: string; b?: number }>();
      } else {
        expectTypeOf(obj).toMatchTypeOf<{ a?: string; b?: number }>();
      }
    });

    it('narrows optional field to required', () => {
      const obj = {} as { a?: string; b?: number };

      if (hasSubObject(obj, { a: 'a' })) {
        expectTypeOf(obj).toMatchTypeOf<{ a: string; b?: number }>();
      } else {
        expectTypeOf(obj).toMatchTypeOf<{ a?: string; b?: number }>();
      }
    });

    it('narrows field to constant type', () => {
      const obj = {} as { a?: string; b?: number };

      if (hasSubObject(obj, { a: 'a' } as const)) {
        expectTypeOf(obj).toMatchTypeOf<{ readonly a: 'a'; b?: number }>();
      } else {
        expectTypeOf(obj).toMatchTypeOf<{ a?: string; b?: number }>();
      }
    });
  });

  describe('data-last', () => {
    it('must have matching keys and values', () => {
      expectTypeOf(
        pipe({ a: 2 }, hasSubObject({ a: 1 })),
      ).toEqualTypeOf<boolean>();

      // @ts-expect-error [ts2353] - missing a key
      pipe({ b: 2 }, hasSubObject({ a: 1 }));

      // @ts-expect-error [ts2345] - different value type
      pipe({ a: 'a' }, hasSubObject({ a: 1 }));

      // ok - wider value type
      pipe({ a: 'a' } as { a: number | string }, hasSubObject({ a: 1 }));

      // @ts-expect-error [ts2345] - narrower value type
      pipe({ a: 'a' }, hasSubObject({ a: 1 } as { a: number | string }));

      // ok - unknown data type
      pipe({ a: 2 } as unknown, hasSubObject({ a: 1 }));

      // ok - const value
      pipe({ a: 2 }, hasSubObject({ a: 1 } as const));
    });

    it('allows nested objects', () => {
      // ok - nested object has extra keys
      pipe({ a: { b: 4 } }, hasSubObject({ a: { b: 1, c: 2 } }));

      // @ts-expect-error [ts2345] - nested object has missing keys
      pipe({ a: { b: 1, c: 2 } }, hasSubObject({ a: { b: 1 } }));

      // @ts-expect-error [ts2345] - nested object has wrong value types
      pipe({ a: { b: 4, c: 'c' } }, hasSubObject({ a: { b: 1, c: 2 } }));
    });
  });
});
