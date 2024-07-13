import {
  ALL_TYPES_DATA_PROVIDER,
  type AllTypesDataProviderTypes,
  TYPES_DATA_PROVIDER,
} from '../test/types-data-provider';
import { isDate } from './is-date';

it('should work as type guard', () => {
  const data = TYPES_DATA_PROVIDER.date as AllTypesDataProviderTypes;
  if (isDate(data)) {
    expectTypeOf(data).toEqualTypeOf<Date>();
  }
});

it('should narrow `unknown`', () => {
  const data = TYPES_DATA_PROVIDER.date as unknown;
  if (isDate(data)) {
    expectTypeOf(data).toEqualTypeOf<Date>();
  }
});

it('should work as type guard in filter', () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isDate);
  expectTypeOf(data).toEqualTypeOf<Array<Date>>();
});
