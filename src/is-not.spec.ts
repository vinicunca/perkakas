import {
  ALL_TYPES_DATA_PROVIDER,
  type AllTypesDataProviderTypes,
  TYPES_DATA_PROVIDER,
} from '../test/types-data-provider';
import { isNot } from './is-not';
import { isPromise } from './is-promise';
import { isString } from './is-string';

it('should work as type guard', () => {
  const data = TYPES_DATA_PROVIDER.promise as AllTypesDataProviderTypes;
  if (isNot(isString)(data)) {
    expect(data instanceof Promise).toBe(true);
  }
});

it('should work as type guard in filter', () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isNot(isPromise));
  expect(data.some((c) => c instanceof Promise)).toBe(false);
});
