import { describe, expect, expectTypeOf, it } from 'vitest';

import type { AllTypesDataProviderTypes } from '../../test/types-data-provider';

import { ALL_TYPES_DATA_PROVIDER, TYPES_DATA_PROVIDER } from '../../test/types-data-provider';
import { isBoolean } from './is-boolean';

describe('isBoolean', () => {
  it('should work as type guard', () => {
    const data = TYPES_DATA_PROVIDER.boolean as AllTypesDataProviderTypes;
    if (isBoolean(data)) {
      expect(typeof data).toEqual('boolean');
      expectTypeOf(data).toEqualTypeOf<boolean>();
    }
  });

  it('should narrow `unknown`', () => {
    const data = TYPES_DATA_PROVIDER.boolean as unknown;
    if (isBoolean(data)) {
      expect(typeof data).toEqual('boolean');
      expectTypeOf(data).toEqualTypeOf<boolean>();
    }
  });

  it('should narrow `any`', () => {
    const data = TYPES_DATA_PROVIDER.boolean as any;
    if (isBoolean(data)) {
      expect(typeof data).toEqual('boolean');
      expectTypeOf(data).toEqualTypeOf<boolean>();
    }
  });

  it('should work as type guard in filter', () => {
    const data = ALL_TYPES_DATA_PROVIDER.filter(isBoolean);
    expect(data.every((c) => typeof c === 'boolean')).toEqual(true);
    expectTypeOf(data).toEqualTypeOf<Array<boolean>>();
  });
});
