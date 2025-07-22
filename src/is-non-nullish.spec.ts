import { expect, it } from 'vitest';
import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
} from '../test/types-data-provider';
import { isNonNullish } from './is-non-nullish';

it('should work as type guard', () => {
  expect(isNonNullish(TYPES_DATA_PROVIDER.date)).toBe(true);
});

it('should work as type guard in filter', () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isNonNullish);

  expect(data).toHaveLength(17);
});
