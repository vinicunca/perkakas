import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
} from '../test/types-data-provider';
import { isBoolean } from './is-boolean';

it('should work as type guard', () => {
  expect(isBoolean(TYPES_DATA_PROVIDER.boolean)).toBe(true);
});

it('should work as type guard in filter', () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isBoolean);

  expect(data.every((c) => typeof c === 'boolean')).toBe(true);
});
