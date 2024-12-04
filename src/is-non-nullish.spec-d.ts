import {
  ALL_TYPES_DATA_PROVIDER,
  type AllTypesDataProviderTypes,
  type TestClass,
  TYPES_DATA_PROVIDER,
} from '../test/types-data-provider';
import { isNonNullish } from './is-non-nullish';

it('should work as type guard', () => {
  const data = TYPES_DATA_PROVIDER.date as AllTypesDataProviderTypes;
  if (isNonNullish(data)) {
    expectTypeOf(data).toEqualTypeOf<
      | Array<number>
      | Date
      | Error
      | Map<string, string>
      | Promise<number>
      | RegExp
      | Set<string>
      | TestClass
      // | Uint8Array
      | boolean
      | number
      | string
      | symbol
      | 1n
      | (() => void)
      | { readonly a: 'asd' }
      | [number, number, number]
    >();
  }
});

it('should work as type guard in filter', () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isNonNullish);
  expectTypeOf(data).toEqualTypeOf<
    Array<
      | Array<number>
      | Date
      | Error
      | Map<string, string>
      | Promise<number>
      | RegExp
      | Set<string>
      | TestClass
      // | Uint8Array
      | boolean
      | number
      | string
      | symbol
      | 1n
      | (() => void)
      | { readonly a: 'asd' }
      | [number, number, number]
    >
  >();
});
