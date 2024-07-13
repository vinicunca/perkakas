import {
  ALL_TYPES_DATA_PROVIDER,
  type AllTypesDataProviderTypes,
  TYPES_DATA_PROVIDER,
} from '../test/types-data-provider';
import { isNumber } from './is-number';

const dataFunction = (): string | 1 | 2 | 3 => 1;

it('should work as type guard', () => {
  const data = TYPES_DATA_PROVIDER.number as AllTypesDataProviderTypes;
  if (isNumber(data)) {
    expectTypeOf(data).toEqualTypeOf<number>();
  }
});

it('should work as type guard in filter', () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isNumber);
  expectTypeOf(data).toEqualTypeOf<Array<number>>();
});

it('should work even if data type is unknown', () => {
  const data = TYPES_DATA_PROVIDER.number as unknown;
  if (isNumber(data)) {
    expectTypeOf(data).toEqualTypeOf<number>();
  }
});

it('should work with literal types', () => {
  const x = dataFunction();
  if (isNumber(x)) {
    expectTypeOf(x).toEqualTypeOf<1 | 2 | 3>(x);
  }
});
