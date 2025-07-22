import type { AllTypesDataProviderTypes } from '../test/types-data-provider';
import { expect, it } from 'vitest';
import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
} from '../test/types-data-provider';
import { isArray } from './is-array';

it('should work as type guard', () => {
  const data = TYPES_DATA_PROVIDER.array as AllTypesDataProviderTypes;
  if (isArray(data)) {
    expect(Array.isArray(data)).toBe(true);
  }
});

it('should work as type guard in filter', () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isArray);
  expect(data.every((c) => Array.isArray(c))).toBe(true);
});
