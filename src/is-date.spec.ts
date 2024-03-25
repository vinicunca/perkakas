import { describe, expect, expectTypeOf, it } from 'vitest';

import type { AllTypesDataProviderTypes } from '../../test/types-data-provider';

import { ALL_TYPES_DATA_PROVIDER, TYPES_DATA_PROVIDER } from '../../test/types-data-provider';
import { isDate } from './is-date';

describe('isDate', () => {
  it('should work as type guard', () => {
    const data = TYPES_DATA_PROVIDER.date as AllTypesDataProviderTypes;
    if (isDate(data)) {
      expect(data instanceof Date).toEqual(true);
      expectTypeOf(data).toEqualTypeOf<Date>();
    }
  });

  it('should narrow `unknown`', () => {
    const data = TYPES_DATA_PROVIDER.date as unknown;
    if (isDate(data)) {
      expectTypeOf(data).toEqualTypeOf<Date>();
    }
  });

  it('should work as type guard in filter', () => {
    const data = ALL_TYPES_DATA_PROVIDER.filter(isDate);
    expect(data.every((c) => c instanceof Date)).toEqual(true);
    expectTypeOf(data).toEqualTypeOf<Array<Date>>();
  });
});
