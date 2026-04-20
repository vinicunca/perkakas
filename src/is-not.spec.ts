import { expect, it } from 'vitest';
import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
} from '../test/types-data-provider';
import { isNot } from './is-not';
import { isPromise } from './is-promise';
import { isString } from './is-string';

it('should work as type guard', () => {
  expect(isNot(isString)(TYPES_DATA_PROVIDER.promise)).toBe(true);
});

it('should work as type guard in filter', () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isNot(isPromise));

  expect(data.some((c) => c instanceof Promise)).toBe(false);
});
