import { describe, expect, expectTypeOf, it } from 'vitest';

import { isEmpty } from './is-empty';

describe('isEmpty', () => {
  it('returns true for an empty array', () => {
    expect(isEmpty([])).toBe(true);
  });
  it('returns false for a non-empty array', () => {
    expect(isEmpty([1, 2, 3])).toBe(false);
  });

  it('returns true for an empty string', () => {
    expect(isEmpty('')).toBe(true);
  });

  it('returns false for a non-empty string', () => {
    expect(isEmpty('test')).toBe(false);
  });

  it('returns true for an empty object', () => {
    expect(isEmpty({})).toBe(true);
  });

  it('returns false for a non-empty object', () => {
    expect(isEmpty({ length: 0 })).toBe(false);
  });

  it('returns true for undefined', () => {
    expect(isEmpty(undefined)).toBe(true);
  });

  it('does not accept invalid input types', () => {
    // @ts-expect-error [ts2769] number is not a valid input type
    isEmpty(2);

    // @ts-expect-error [ts2769] boolean is not a valid input type
    isEmpty(false);

    // @ts-expect-error [ts2769] null is not a valid input type
    isEmpty(null);

    // @ts-expect-error [ts2769] undefined is only allowed with strings
    isEmpty([] as ReadonlyArray<string> | undefined);

    // @ts-expect-error [ts2769] undefined is only allowed with strings
    isEmpty({} as Record<string, string> | undefined);
  });
});

describe('strings are narrowed correctly', () => {
  it('just undefined', () => {
    const data = undefined;
    if (isEmpty(data)) {
      expectTypeOf(data).toEqualTypeOf<undefined>();
    }
  });

  it('just string', () => {
    const data = '' as string;
    if (isEmpty(data)) {
      expectTypeOf(data).toEqualTypeOf<''>();
    }
  });

  it('just EMPTY string', () => {
    const data = '' as const;
    if (isEmpty(data)) {
      expectTypeOf(data).toEqualTypeOf<''>();
    }
  });

  it('string or undefined', () => {
    const data = undefined as string | undefined;
    if (isEmpty(data)) {
      expectTypeOf(data).toEqualTypeOf<'' | undefined>();
    }
  });

  it('string literals that CANT be empty or undefined', () => {
    const data = 'cat' as 'cat' | 'dog';
    if (isEmpty(data)) {
      // unreachable
      expectTypeOf(data).toEqualTypeOf<never>();
    }
  });

  it('string literals that CAN be empty', () => {
    const data = 'cat' as '' | 'cat' | 'dog';
    if (isEmpty(data)) {
      expectTypeOf(data).toEqualTypeOf<''>();
    }
  });

  it('string literals that CAN be undefined', () => {
    const data = 'cat' as 'cat' | 'dog' | undefined;
    if (isEmpty(data)) {
      expectTypeOf(data).toEqualTypeOf<undefined>();
    }
  });

  it('string literals that CAN be undefined or empty', () => {
    const data = 'cat' as '' | 'cat' | 'dog' | undefined;
    if (isEmpty(data)) {
      expectTypeOf(data).toEqualTypeOf<'' | undefined>();
    }
  });

  it('string templates that CANT be empty or undefined', () => {
    const data = 'prefix_0' as `prefix_${number}`;
    if (isEmpty(data)) {
      // unreachable
      expectTypeOf(data).toEqualTypeOf<never>();
    }
  });

  it('string templates that CAN be empty', () => {
    const data = '' as '' | `prefix_${number}`;
    if (isEmpty(data)) {
      expectTypeOf(data).toEqualTypeOf<''>();
    }
  });

  it('string templates that CAN be undefined', () => {
    const data = 'prefix_0' as `prefix_${number}` | undefined;
    if (isEmpty(data)) {
      expectTypeOf(data).toEqualTypeOf<undefined>();
    }
  });

  it('string templates that CAN be undefined or empty', () => {
    const data = 'prefix_0' as '' | `prefix_${number}` | undefined;
    if (isEmpty(data)) {
      expectTypeOf(data).toEqualTypeOf<'' | undefined>();
    }
  });
});
