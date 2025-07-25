import { expect, it } from 'vitest';
import { ALL_TYPES_DATA_PROVIDER, TYPES_DATA_PROVIDER } from '../test/types-data-provider';
import { isBigInt } from './is-big-int';

it('should work as type guard', () => {
  expect(isBigInt(TYPES_DATA_PROVIDER.bigint)).toBe(true);
});

it('should work as type guard in filter', () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isBigInt);

  expect(data.every((c) => typeof c === 'bigint')).toBe(true);
});
