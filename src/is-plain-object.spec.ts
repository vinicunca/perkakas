import { expect, it } from 'vitest';
import {
  ALL_TYPES_DATA_PROVIDER,
  TestClass,
} from '../test/types-data-provider';
import { isPlainObject } from './is-plain-object';

it('accepts simple objects', () => {
  expect(isPlainObject({ a: 123 })).toBe(true);
});

it('accepts trivial empty objects', () => {
  expect(isPlainObject({})).toBe(true);
});

it('rejects strings', () => {
  expect(isPlainObject('asd')).toBe(false);
});

it('rejects arrays', () => {
  expect(isPlainObject([1, 2, 3])).toBe(false);
});

it('rejects classes', () => {
  expect(isPlainObject(new TestClass())).toBe(false);
});

it('accepts null prototypes', () => {
  expect(isPlainObject(Object.create(null))).toBe(true);
});

it('aLL_TYPES_DATA_PROVIDER', () => {
  expect(ALL_TYPES_DATA_PROVIDER.filter(isPlainObject)).toMatchInlineSnapshot(`
        [
          {
            "a": "asd",
          },
        ]
      `);
});
