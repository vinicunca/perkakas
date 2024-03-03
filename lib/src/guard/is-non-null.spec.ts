import { describe, expect, expectTypeOf, it } from 'vitest';

import type { AllTypesDataProviderTypes } from '../../test/types-data-provider';

import { ALL_TYPES_DATA_PROVIDER, TYPES_DATA_PROVIDER } from '../../test/types-data-provider';
import { isNonNull } from './is-non-null';

describe('isNonNull', () => {
  it('should work as type guard', () => {
    const data = TYPES_DATA_PROVIDER.date as AllTypesDataProviderTypes;
    if (isNonNull(data)) {
      expect(data instanceof Date).toEqual(true);
      expectTypeOf(data).toEqualTypeOf<
        | (() => void)
        | [number, number, number]
        | { readonly a: 'asd' }
        | Array<number>
        | Date
        | Error
        | Map<string, string>
        | Promise<number>
        | RegExp
        | Set<string>
        | TestClass
        | Uint8Array
        | boolean
        | number
        | string
        | symbol
        | undefined
      >();
    }
  });
  it('should work as type guard in filter', () => {
    const data = ALL_TYPES_DATA_PROVIDER.filter(isNonNull);
    expect(data).toHaveLength(17);
    expectTypeOf(data).toEqualTypeOf<
      Array<
        | (() => void)
        | [number, number, number]
        | { readonly a: 'asd' }
        | Array<number>
        | Date
        | Error
        | Map<string, string>
        | Promise<number>
        | RegExp
        | Set<string>
        | TestClass
        | Uint8Array
        | boolean
        | number
        | string
        | symbol
        | undefined
      >
          >(data);
  });
});
