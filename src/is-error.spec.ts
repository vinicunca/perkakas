import { expect, it } from 'vitest';
import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
} from '../test/types-data-provider';
import { isError } from './is-error';

it('should work as type guard', () => {
  expect(isError(TYPES_DATA_PROVIDER.error)).toBe(true);
});

it('should work as type guard in filter', () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isError);

  expect(data.every((c) => c instanceof Error)).toBe(true);
});
