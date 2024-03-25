import { describe, expect, expectTypeOf, it } from 'vitest';

import type { AllTypesDataProviderTypes } from './../test/types-data-provider';

import { ALL_TYPES_DATA_PROVIDER, TYPES_DATA_PROVIDER } from './../test/types-data-provider';
import { isArray } from './is-array';

describe('isArray', () => {
  it('should infer ReadonlyArray<unknown> when given any', () => {
    const data = [] as any;
    if (isArray(data)) {
      expectTypeOf(data).not.toBeAny();
      expectTypeOf(data[0]).toBeUnknown();
    }
  });

  it('should work as type guard', () => {
    const data = TYPES_DATA_PROVIDER.array as AllTypesDataProviderTypes;
    if (isArray(data)) {
      expect(Array.isArray(data)).toEqual(true);
      expectTypeOf(data).toEqualTypeOf<
        [number, number, number] | Array<number>
      >();
    }
  });

  it('should infer ReadonlyArray<unknown> when given `unknown`', () => {
    const data = TYPES_DATA_PROVIDER.array as unknown;
    if (isArray(data)) {
      expectTypeOf(data).toEqualTypeOf<ReadonlyArray<unknown>>();
    }
  });

  it('should work as type guard in filter', () => {
    const data = ALL_TYPES_DATA_PROVIDER.filter(isArray);
    expect(data.every((c) => Array.isArray(c))).toEqual(true);
    expectTypeOf(data).toEqualTypeOf<
      Array<[number, number, number] | Array<number>>
    >();
  });
});

describe('typing', () => {
  it('mutable arrays work', () => {
    const data = [] as Array<number> | string;

    if (isArray(data)) {
      expectTypeOf(data).toEqualTypeOf<Array<number>>();
    }

    expectTypeOf([data].filter(isArray))
      .toEqualTypeOf<Array<Array<number>>>();
  });

  it('readonly arrays work', () => {
    const data = [] as ReadonlyArray<number> | string;

    if (isArray(data)) {
      expectTypeOf(data).toEqualTypeOf<ReadonlyArray<number>>();
    }

    expectTypeOf([data].filter(isArray))
      .toEqualTypeOf<Array<ReadonlyArray<number>>>();
  });
});
