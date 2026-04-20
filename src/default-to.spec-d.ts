import { describe, expectTypeOf, it } from 'vitest';
import { defaultTo } from './default-to';
import { pipe } from './pipe';

describe('primitive types (string)', () => {
  describe('data-first', () => {
    it('undefinable primitive', () => {
      expectTypeOf(
        defaultTo('a' as string | undefined, 'value' as string),
      ).toEqualTypeOf<string>();
    });

    it('nullable primitive', () => {
      expectTypeOf(
        defaultTo('a' as string | null, 'value' as string),
      ).toEqualTypeOf<string>();
    });

    it('nullish primitive', () => {
      expectTypeOf(
        defaultTo('a' as string | null | undefined, 'value'),
      ).toEqualTypeOf<string>();
    });

    it('undefinable primitive with literal fallback', () => {
      expectTypeOf(
        defaultTo('a' as string | undefined, 'value'),
      ).toEqualTypeOf<string>();
    });

    it('nullable primitive with literal fallback', () => {
      expectTypeOf(
        defaultTo('a' as string | null, 'value'),
      ).toEqualTypeOf<string>();
    });

    it('nullish literal with literal fallback', () => {
      expectTypeOf(
        defaultTo('a' as 'a' | 'b' | null | undefined, 'a'),
      ).toEqualTypeOf<'a' | 'b'>();
    });

    it('undefinable literal union', () => {
      expectTypeOf(defaultTo('a' as 'a' | 'b' | undefined, 'a')).toEqualTypeOf<
        'a' | 'b'
      >();
    });

    it('nullable literal', () => {
      expectTypeOf(defaultTo('a' as 'a' | 'b' | null, 'a')).toEqualTypeOf<
        'a' | 'b'
      >();
    });

    describe('error cases', () => {
      it('non-nullish primitive', () => {
        defaultTo(
          'a' as string,
          // @ts-expect-error [ts2345] -- the fallback is never because it will
          // never be used.
          'b' as string,
        );
      });

      it('non-nullish literal union', () => {
        defaultTo(
          'a' as 'a' | 'b',
          // @ts-expect-error [ts2345] -- the fallback is never because it will
          // never be used.
          'b',
        );
      });

      it('incompatible primitive fallback', () => {
        defaultTo(
          'a' as string | undefined,
          // @ts-expect-error [ts2345] -- the fallback is incompatible with the
          // data type.
          1 as number,
        );
      });

      it('incompatible literal fallback', () => {
        defaultTo(
          'a' as 'a' | 'b' | undefined,
          // @ts-expect-error [ts2345] -- the fallback is incompatible with the
          // data type.
          'c',
        );
      });

      it('incompatible widening', () => {
        defaultTo(
          'a' as 'a' | 'b' | undefined,
          // @ts-expect-error [ts2345] -- the fallback is incompatible with the
          // data type.
          'c' as string,
        );
      });

      it('null for undefinable primitive', () => {
        defaultTo(
          'a' as string | undefined,
          // @ts-expect-error [ts2345] -- the fallback is incompatible with the
          // data type.
          null,
        );
      });

      it('undefined for nullable primitive', () => {
        defaultTo(
          'a' as string | null,
          // @ts-expect-error [ts2345] -- the fallback is incompatible with the
          // data type.
          undefined,
        );
      });
    });
  });

  describe('data-last', () => {
    it('undefinable primitive', () => {
      expectTypeOf(
        pipe('a' as string | undefined, defaultTo('value' as string)),
      ).toEqualTypeOf<string>();
    });

    it('nullable primitive', () => {
      expectTypeOf(
        pipe('a' as string | null, defaultTo('value' as string)),
      ).toEqualTypeOf<string>();
    });

    it('nullish primitive', () => {
      expectTypeOf(
        pipe('a' as string | null | undefined, defaultTo('value')),
      ).toEqualTypeOf<string>();
    });

    it('undefinable literal union', () => {
      expectTypeOf(
        pipe('a' as 'a' | 'b' | undefined, defaultTo('a')),
      ).toEqualTypeOf<'a' | 'b'>();
    });

    it('nullable literal', () => {
      expectTypeOf(pipe('a' as 'a' | 'b' | null, defaultTo('a'))).toEqualTypeOf<
        'a' | 'b'
      >();
    });

    it('nullish literal', () => {
      expectTypeOf(
        pipe('a' as 'a' | 'b' | null | undefined, defaultTo('a')),
      ).toEqualTypeOf<'a' | 'b'>();
    });

    describe('error cases', () => {
      it('non-nullish primitive', () => {
        pipe(
          'a' as string,
          // @ts-expect-error [ts2345] -- the fallback is never because it will
          // never be used.
          defaultTo('b' as string),
        );
      });

      it('non-nullish literal union', () => {
        pipe(
          'a' as 'a' | 'b',
          // @ts-expect-error [ts2345] -- the fallback is never because it will
          // never be used.
          defaultTo('b'),
        );
      });

      it('incompatible primitive fallback', () => {
        pipe(
          'a' as string | undefined,
          // @ts-expect-error [ts2345] -- the fallback is incompatible with the
          // data type.
          defaultTo(1 as number),
        );
      });

      it('incompatible literal fallback', () => {
        pipe(
          'a' as 'a' | 'b' | undefined,
          // @ts-expect-error [ts2345] -- the fallback is incompatible with the
          // data type.
          defaultTo('c'),
        );
      });

      it('incompatible widening', () => {
        pipe(
          'a' as 'a' | 'b' | undefined,
          // @ts-expect-error [ts2345] -- the fallback is incompatible with the
          // data type.
          defaultTo('c' as string),
        );
      });

      it('null for undefinable primitive', () => {
        pipe(
          'a' as string | undefined,
          // @ts-expect-error [ts2345] -- the fallback is incompatible with the
          // data type.
          defaultTo(null),
        );
      });

      it('undefined for nullable primitive', () => {
        pipe(
          'a' as string | null,
          // @ts-expect-error [ts2345] -- the fallback is incompatible with the
          // data type.
          defaultTo(undefined),
        );
      });
    });
  });
});

describe('object types', () => {
  describe('data-first', () => {
    it('undefinable object', () => {
      expectTypeOf(
        defaultTo(
          { a: 'a' } as { a: string } | undefined,
          { a: 'b' } as { a: string },
        ),
      ).toEqualTypeOf<{ a: string }>();
    });

    it('nullable object', () => {
      expectTypeOf(
        defaultTo(
          { a: 'a' } as { a: string } | null,
          { a: 'b' } as { a: string },
        ),
      ).toEqualTypeOf<{ a: string }>();
    });

    it('undefinable object with literal fallback', () => {
      expectTypeOf(
        defaultTo({ a: 'a' } as { a: string } | undefined, { a: 'b' } as const),
      ).toEqualTypeOf<{ a: string } | { readonly a: 'b' }>();
    });

    it('nullable object with literal fallback', () => {
      expectTypeOf(
        defaultTo({ a: 'a' } as { a: string } | null, { a: 'b' } as const),
      ).toEqualTypeOf<{ a: string } | { readonly a: 'b' }>();
    });

    describe('error cases', () => {
      it('non-nullish object', () => {
        // @ts-expect-error [ts2345] -- the fallback is never because it will
        // never be used.
        defaultTo({ a: 'a' } as { a: string }, { a: 'b' });
      });

      it('incompatible object fallback', () => {
        // @ts-expect-error [ts2322] -- the fallback is incompatible with the
        // data type.
        defaultTo({ a: 'a' } as { a: 'a' } | undefined, { a: 'b' });
      });
    });
  });

  describe('data-last', () => {
    it('undefinable object', () => {
      expectTypeOf(
        pipe(
          { a: 'a' } as { a: string } | undefined,
          defaultTo({ a: 'b' } as { a: string }),
        ),
      ).toEqualTypeOf<{ a: string }>();
    });

    it('nullable object', () => {
      expectTypeOf(
        pipe(
          { a: 'a' } as { a: string } | null,
          defaultTo({ a: 'b' } as { a: string }),
        ),
      ).toEqualTypeOf<{ a: string }>();
    });

    describe('error cases', () => {
      it('non-nullish object', () => {
        // @ts-expect-error [ts2345] -- the fallback is never because it will
        // never be used.
        pipe({ a: 'a' } as { a: string }, defaultTo({ a: 'b' }));
      });

      it('incompatible object fallback', () => {
        // @ts-expect-error [ts2322] -- the fallback is incompatible with the
        // data type.
        pipe({ a: 'a' } as { a: 'a' } | undefined, defaultTo({ a: 'b' }));
      });
    });
  });
});

describe('nullish fallbacks', () => {
  describe('data-first', () => {
    it('undefined fallback', () => {
      expectTypeOf(
        defaultTo(
          { a: 'a' } as { a: string } | undefined,
          { a: 'b' } as { a: string } | undefined,
        ),
      ).toEqualTypeOf<{ a: string } | undefined>();
    });

    it('null fallback', () => {
      expectTypeOf(
        defaultTo(
          { a: 'a' } as { a: string } | null,
          { a: 'b' } as { a: string } | null,
        ),
      ).toEqualTypeOf<{ a: string } | null>();
    });

    it('nullish fallback', () => {
      expectTypeOf(
        defaultTo(
          { a: 'a' } as { a: string } | null | undefined,
          { a: 'b' } as { a: string } | null | undefined,
        ),
      ).toEqualTypeOf<{ a: string } | null | undefined>();
    });

    it('narrowing nullish fallback to undefined', () => {
      expectTypeOf(
        defaultTo(
          { a: 'a' } as { a: string } | null | undefined,
          { a: 'b' } as { a: string } | undefined,
        ),
      ).toEqualTypeOf<{ a: string } | undefined>();
    });

    it('narrowing nullish fallback to null', () => {
      expectTypeOf(
        defaultTo(
          { a: 'a' } as { a: string } | null | undefined,
          { a: 'b' } as { a: string } | null,
        ),
      ).toEqualTypeOf<{ a: string } | null>();
    });
  });

  describe('data-last', () => {
    it('undefined fallback', () => {
      expectTypeOf(
        pipe(
          { a: 'a' } as { a: string } | undefined,
          defaultTo({ a: 'b' } as { a: string } | undefined),
        ),
      ).toEqualTypeOf<{ a: string } | undefined>();
    });

    it('null fallback', () => {
      expectTypeOf(
        pipe(
          { a: 'a' } as { a: string } | null,
          defaultTo({ a: 'b' } as { a: string } | null),
        ),
      ).toEqualTypeOf<{ a: string } | null>();
    });

    it('nullish fallback', () => {
      expectTypeOf(
        pipe(
          { a: 'a' } as { a: string } | null | undefined,
          defaultTo({ a: 'b' } as { a: string } | null | undefined),
        ),
      ).toEqualTypeOf<{ a: string } | null | undefined>();
    });

    it('narrowing nullish fallback to undefined', () => {
      expectTypeOf(
        pipe(
          { a: 'a' } as { a: string } | null | undefined,
          defaultTo({ a: 'b' } as { a: string } | undefined),
        ),
      ).toEqualTypeOf<{ a: string } | undefined>();
    });

    it('narrowing nullish fallback to null', () => {
      expectTypeOf(
        pipe(
          { a: 'a' } as { a: string } | null | undefined,
          defaultTo({ a: 'b' } as { a: string } | null),
        ),
      ).toEqualTypeOf<{ a: string } | null>();
    });
  });
});
