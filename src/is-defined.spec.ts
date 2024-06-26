import {
  ALL_TYPES_DATA_PROVIDER,
  type AllTypesDataProviderTypes,
  TYPES_DATA_PROVIDER,
  type TestClass,
} from '../test/types-data-provider';
import { isDefined } from './is-defined';

describe('isDefined', () => {
  it('should work as type guard', () => {
    const data = TYPES_DATA_PROVIDER.date as AllTypesDataProviderTypes;
    if (isDefined(data)) {
      expect(data instanceof Date).toBe(true);
      expectTypeOf(data).toEqualTypeOf<
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
        | 1n
        | (() => void)
        | { readonly a: 'asd' }
        | [number, number, number]
        | null
      >();
    }
  });

  it('should work as type guard in filter', () => {
    const data = ALL_TYPES_DATA_PROVIDER.filter(isDefined);
    expect(data).toHaveLength(18);
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
        | Uint8Array
        | boolean
        | number
        | string
        | symbol
        | 1n
        | (() => void)
        | { readonly a: 'asd' }
        | [number, number, number]
        | null
      >
    >();
  });
});
