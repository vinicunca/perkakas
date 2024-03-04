import { describe, expect, expectTypeOf, it } from 'vitest';

import type { AllTypesDataProviderTypes, TestClass } from '../../test/types-data-provider';

import { ALL_TYPES_DATA_PROVIDER, TYPES_DATA_PROVIDER } from '../../test/types-data-provider';
import { isNot } from './is-not';
import { isPromise } from './is-promise';
import { isString } from './is-string';

describe('isNot', () => {
  it('should work as type guard', () => {
    const data = TYPES_DATA_PROVIDER.promise as AllTypesDataProviderTypes;
    if (isNot(isString)(data)) {
      expect(data instanceof Promise).toEqual(true);
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
        | null
        | number
        | symbol
        | undefined
          >(data);
    }
  });

  it('should work as type guard in filter', () => {
    const data = ALL_TYPES_DATA_PROVIDER.filter(isNot(isPromise));
    expect(data.some((c) => c instanceof Promise)).toEqual(false);
    expectTypeOf(data).toEqualTypeOf<
      Array<
        | (() => void)
        | [number, number, number]
        | { readonly a: 'asd' }
        | Array<number>
        | Date
        | Error
        | Map<string, string>
        | RegExp
        | Set<string>
        | TestClass
        | Uint8Array
        | boolean
        | null
        | number
        | string
        | symbol
        | undefined
      >
    >();
  });
});
