import type { AllTypesDataProviderTypes } from '../test/types-data-provider';
import { expectTypeOf, it } from 'vitest';
import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
} from '../test/types-data-provider';
import { isSymbol } from './is-symbol';

it('should work as type guard', () => {
  const data = TYPES_DATA_PROVIDER.symbol as AllTypesDataProviderTypes;
  if (isSymbol(data)) {
    expectTypeOf(data).toEqualTypeOf<symbol>();
  }
});

it('should work even if data type is `unknown`', () => {
  const data = TYPES_DATA_PROVIDER.symbol as unknown;
  if (isSymbol(data)) {
    expectTypeOf(data).toEqualTypeOf<symbol>();
  }
});

it('should work even if data type is `any`', () => {
  // eslint-disable-next-line ts/no-explicit-any -- Explicitly checking any
  const data = TYPES_DATA_PROVIDER.symbol as any;
  if (isSymbol(data)) {
    expectTypeOf(data).toEqualTypeOf<symbol>();
  }
});

it('should work as type guard in array', () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isSymbol);
  expectTypeOf(data).toEqualTypeOf<Array<symbol>>();
});
