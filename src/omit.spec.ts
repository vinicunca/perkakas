import { describe, expect, expectTypeOf, it } from 'vitest';

import { pipe } from '../pipe';
import { omit } from './omit';

describe('data first', () => {
  it('omit', () => {
    const result = omit({ a: 1, b: 2, c: 3, d: 4 }, ['a', 'd'] as const);
    expect(result).toEqual({ b: 2, c: 3 });
  });

  it('single removed prop works', () => {
    const obj: { a: number } = { a: 1 };
    const result = omit(obj, ['a']);
    expect(result).toEqual({});
  });
});

describe('data last', () => {
  it('omit', () => {
    const result = pipe({ a: 1, b: 2, c: 3, d: 4 }, omit(['a', 'd'] as const));
    expect(result).toEqual({ b: 2, c: 3 });
  });
});

describe('typing', () => {
  describe('data first', () => {
    it('non existing prop', () => {
      // @ts-expect-error [ts2322] -- should not allow non existing props
      omit({ a: 1, b: 2, c: 3, d: 4 }, ['not', 'in'] as const);
    });

    it('complex type', () => {
      const obj = { a: 1 } as { a: number } | { a?: number; b: string };
      const result = omit(obj, ['a']);
      expectTypeOf(result).toEqualTypeOf<
        Omit<{ a: number } | { a?: number; b: string }, 'a'>
      >();
    });
  });

  describe('data last', () => {
    it('non existing prop', () => {
      pipe(
        { a: 1, b: 2, c: 3, d: 4 },
        // @ts-expect-error [ts2345] -- should not allow non existing props
        omit(['not', 'in'] as const),
      );
    });

    it('complex type', () => {
      const obj = { a: 1 } as { a: number } | { a?: number; b: string };
      const result = pipe(obj, omit(['a']));
      expectTypeOf(result).toEqualTypeOf<
        Omit<{ a: number } | { a?: number; b: string }, 'a'>
      >();
    });
  });
});
