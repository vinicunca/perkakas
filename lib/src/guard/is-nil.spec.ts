import { describe, expect, expectTypeOf, it } from 'vitest';

import type { AllTypesDataProviderTypes } from '../../test/types-data-provider';

import { ALL_TYPES_DATA_PROVIDER, TYPES_DATA_PROVIDER } from '../../test/types-data-provider';
import { isNil } from './is-nil';

describe('isNil', () => {
  it('should work as type guard', () => {
    const data = TYPES_DATA_PROVIDER.null as AllTypesDataProviderTypes;
    if (isNil(data)) {
      expect(data).toEqual(null);
      expectTypeOf(data).toEqualTypeOf<null | undefined>();
    }
  });

  it('should work as type guard in filter', () => {
    const data = ALL_TYPES_DATA_PROVIDER.filter(isNil);
    expect(data.every((c) => c == null)).toEqual(true);
    expectTypeOf(data).toEqualTypeOf<Array<null | undefined>>();
  });
});
