import { describe, expect, expectTypeOf, it } from 'vitest';

import type { AllTypesDataProviderTypes } from '../test/types-data-provider';

import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
} from '../test/types-data-provider';
import { isNullish } from './is-nullish';

describe('isNullish', () => {
  it('should work as type guard', () => {
    const data = TYPES_DATA_PROVIDER.null as AllTypesDataProviderTypes;
    if (isNullish(data)) {
      expect(data).toEqual(null);
      expectTypeOf(data).toEqualTypeOf<null | undefined>();
    }
  });

  it('should work as type guard in filter', () => {
    const data = ALL_TYPES_DATA_PROVIDER.filter(isNullish);
    expect(data.every((c) => c === null || c === undefined)).toEqual(true);
    expectTypeOf(data).toEqualTypeOf<Array<null | undefined>>();
  });
});
