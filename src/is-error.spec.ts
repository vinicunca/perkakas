import {
  ALL_TYPES_DATA_PROVIDER,
  type AllTypesDataProviderTypes,
  TYPES_DATA_PROVIDER,
} from '../test/types-data-provider';
import { isError } from './is-error';

it('should work as type guard', () => {
  const data = TYPES_DATA_PROVIDER.error as AllTypesDataProviderTypes;
  if (isError(data)) {
    expect(data instanceof Error).toEqual(true);
  }
});

it('should work as type guard in filter', () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isError);
  expect(data.every((c) => c instanceof Error)).toEqual(true);
});
