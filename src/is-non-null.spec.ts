import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
} from '../test/types-data-provider';
import { isNonNull } from './is-non-null';

it('should work as type guard', () => {
  expect(isNonNull(TYPES_DATA_PROVIDER.date)).toBe(true);
});

it('should work as type guard in filter', () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isNonNull);

  expect(data).toHaveLength(17);
});
