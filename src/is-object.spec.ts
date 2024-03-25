import { describe, expect, expectTypeOf, it } from 'vitest';

import type { AllTypesDataProviderTypes } from './../test/types-data-provider';

import { ALL_TYPES_DATA_PROVIDER, TYPES_DATA_PROVIDER, TestClass } from './../test/types-data-provider';
import { isObject } from './is-object';

describe('runtime', () => {
  it('accepts simple objects', () => {
    expect(isObject({ a: 123 })).toEqual(true);
  });

  it('accepts trivial empty objects', () => {
    expect(isObject({})).toEqual(true);
  });

  it('rejects strings', () => {
    expect(isObject('asd')).toEqual(false);
  });

  it('rejects arrays', () => {
    expect(isObject([1, 2, 3])).toEqual(false);
  });

  it('rejects classes', () => {
    expect(isObject(new TestClass())).toEqual(false);
  });

  it('accepts null prototypes', () => {
    expect(isObject(Object.create(null))).toEqual(true);
  });

  it('aLL_TYPES_DATA_PROVIDER', () => {
    expect(ALL_TYPES_DATA_PROVIDER.filter(isObject))
      .toMatchInlineSnapshot(`
        [
          {
            "a": "asd",
          },
        ]
      `);
  });
});

describe('typing', () => {
  it('narrows readonly records', () => {
    const data: { readonly a: 123 } = { a: 123 };
    if (isObject(data)) {
      expectTypeOf(data).toEqualTypeOf<{ readonly a: 123 }>();
    }
  });

  it('narrows mixed records', () => {
    const data: { readonly a: 123; b: boolean } = { a: 123, b: false };
    if (isObject(data)) {
      expectTypeOf(data).toEqualTypeOf<{ readonly a: 123; b: boolean }>();
    }
  });

  it('should work as type guard', () => {
    const data = TYPES_DATA_PROVIDER.object as AllTypesDataProviderTypes;
    if (isObject(data)) {
      expectTypeOf(data).toEqualTypeOf<{ readonly a: 'asd' }>();
    }
  });

  it('should work even if data type is unknown', () => {
    const data = TYPES_DATA_PROVIDER.object as unknown;
    if (isObject(data)) {
      expectTypeOf(data).toEqualTypeOf<Record<PropertyKey, unknown>>();
    }
  });

  it('should work as type guard in filter', () => {
    const data = ALL_TYPES_DATA_PROVIDER.filter(isObject);
    expectTypeOf(data).toEqualTypeOf<Array<{ readonly a: 'asd' }>>();
  });

  it('can narrow down `any`', () => {
    const data = { hello: 'world' } as any;
    if (isObject(data)) {
      expectTypeOf(data).toEqualTypeOf<Record<PropertyKey, unknown>>();
    }
  });
});
