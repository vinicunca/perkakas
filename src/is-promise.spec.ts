import {
  ALL_TYPES_DATA_PROVIDER,
  type AllTypesDataProviderTypes,
  TYPES_DATA_PROVIDER,
} from '../test/types-data-provider';
import { isPromise } from './is-promise';

it('should work as type guard', () => {
  const data = TYPES_DATA_PROVIDER.promise as AllTypesDataProviderTypes;
  if (isPromise(data)) {
    expect(data instanceof Promise).toEqual(true);
  }
});

it('should work as type guard in filter', () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isPromise);
  expect(data.every((c) => c instanceof Promise)).toEqual(true);
});
