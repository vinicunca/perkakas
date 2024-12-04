import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
} from '../test/types-data-provider';
import { isDate } from './is-date';

it('should work as type guard', () => {
  expect(isDate(TYPES_DATA_PROVIDER.date)).toBe(true);
});

it('should work as type guard in filter', () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isDate);

  expect(data.every((c) => c instanceof Date)).toBe(true);
});
