import {
  ALL_TYPES_DATA_PROVIDER,
} from '../test/types-data-provider';
import { isNullish } from './is-nullish';

it('accepts nulls', () => {
  expect(isNullish(null)).toBe(true);
});

it('accepts undefined', () => {
  expect(isNullish(undefined)).toBe(true);
});

it('rejects anything else', () => {
  for (const data of ALL_TYPES_DATA_PROVIDER) {
    if (data === null || data === undefined) {
      continue;
    }
    expect(isNullish(data)).toBe(false);
  }
});
