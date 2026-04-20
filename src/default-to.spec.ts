import { describe, expect, it } from 'vitest';
import { defaultTo } from './default-to';

describe('falsy values', () => {
  describe('nullish', () => {
    it('undefined', () => {
      expect(defaultTo(undefined as string | undefined, 'fallback')).toBe(
        'fallback',
      );
    });

    it('null', () => {
      expect(defaultTo(null as string | null, 'fallback')).toBe('fallback');
    });
  });

  describe('non-nullish', () => {
    it('nan', () => {
      // We handle NaN differently than Lodash and Ramda intentionally, we
      // prefer to maintain the ECMAScript semantics for the nullish coalescing
      // operator `??`.
      expect(defaultTo(Number.NaN as number | undefined, 42)).toBe(Number.NaN);
    });

    it('empty string', () => {
      expect(defaultTo('' as string | undefined, 'fallback')).toBe('');
    });

    it('false', () => {
      expect(defaultTo(false as boolean | undefined, true)).toBe(false);
    });

    it('zero', () => {
      expect(defaultTo(0 as number | undefined, 42)).toBe(0);
    });

    it('empty array', () => {
      expect(defaultTo([] as Array<unknown> | undefined, ['a'])).toStrictEqual([]);
    });

    it('empty object', () => {
      expect(
        defaultTo({} as Record<string, unknown> | undefined, { a: 'b' }),
      ).toStrictEqual({});
    });
  });
});

describe('truthy values', () => {
  it('string', () => {
    expect(defaultTo('a' as string | undefined, 'fallback')).toBe('a');
  });

  it('number', () => {
    expect(defaultTo(42 as number | undefined, 0)).toBe(42);
  });

  it('boolean', () => {
    expect(defaultTo(true as boolean | undefined, false)).toBe(true);
  });

  it('array', () => {
    expect(defaultTo(['a'] as Array<string> | undefined, ['b'])).toStrictEqual([
      'a',
    ]);
  });

  it('object', () => {
    expect(
      defaultTo({ a: 'a' } as { a: string } | undefined, { a: 'b' }),
    ).toStrictEqual({ a: 'a' });
  });
});

describe('object identity', () => {
  it('value isn\'t cloned', () => {
    const data = { a: 'a' } as { a: string } | undefined;

    expect(defaultTo(data, { a: 'b' })).toBe(data);
  });

  it('fallback isn\'t cloned', () => {
    const fallback = { a: 'b' };

    expect(defaultTo(undefined as { a: string } | undefined, fallback)).toBe(
      fallback,
    );
  });
});

it('undefined fallback', () => {
  expect(defaultTo(undefined as string | undefined, undefined)).toBeUndefined();
  expect(defaultTo(null as string | null, null)).toBeNull();
});
