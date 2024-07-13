import {
  ALL_TYPES_DATA_PROVIDER,
  type AllTypesDataProviderTypes,
  TYPES_DATA_PROVIDER,
} from '../test/types-data-provider';
import { isString } from './is-string';

const dataFunction = (): number | 'a' | 'b' | 'c' => 'a';

it('should work as type guard', () => {
  const data = TYPES_DATA_PROVIDER.string as AllTypesDataProviderTypes;
  if (isString(data)) {
    expectTypeOf(data).toEqualTypeOf<string>();
  }
});

it('should work even if data type is unknown', () => {
  const data = TYPES_DATA_PROVIDER.string as unknown;
  if (isString(data)) {
    expectTypeOf(data).toEqualTypeOf<string>();
  }
});

it('should work with literal types', () => {
  const x = dataFunction();
  if (isString(x)) {
    expectTypeOf(x).toEqualTypeOf<'a' | 'b' | 'c'>();
  }
});

it('should work as type guard in array', () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isString);
  expectTypeOf(data).toEqualTypeOf<Array<string>>();
});
