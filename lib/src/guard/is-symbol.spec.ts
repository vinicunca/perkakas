import { describe, expect, expectTypeOf, it } from 'vitest';

import type { AllTypesDataProviderTypes } from '../../test/types-data-provider';

import { ALL_TYPES_DATA_PROVIDER, TYPES_DATA_PROVIDER } from '../../test/types-data-provider';
import { isSymbol } from './is-symbol';

describe('isSymbol', () => {
  it('should work as type guard', () => {
    const data = TYPES_DATA_PROVIDER.symbol as AllTypesDataProviderTypes;
    if (isSymbol(data)) {
      expect(typeof data).toEqual('symbol');
      expectTypeOf(data).toEqualTypeOf<symbol>();
    }
  });

  it('should work even if data type is `unknown`', () => {
    const data = TYPES_DATA_PROVIDER.symbol as unknown;
    if (isSymbol(data)) {
      expect(typeof data).toEqual('symbol');
      expectTypeOf(data).toEqualTypeOf<symbol>();
    }
  });

  it('should work even if data type is `any`', () => {
    const data = TYPES_DATA_PROVIDER.symbol as any;
    if (isSymbol(data)) {
      expect(typeof data).toEqual('symbol');
      expectTypeOf(data).toEqualTypeOf<symbol>();
    }
  });

  it('should work as type guard in array', () => {
    const data = ALL_TYPES_DATA_PROVIDER.filter(isSymbol);
    expect(data.every((c) => typeof c === 'symbol')).toEqual(true);
    expectTypeOf(data).toEqualTypeOf<Array<symbol>>();
  });
});
