import {
  ALL_TYPES_DATA_PROVIDER,
  type AllTypesDataProviderTypes,
  TYPES_DATA_PROVIDER,
} from '../test/types-data-provider';
import { isPlainObject } from './is-plain-object';

test('narrows readonly records', () => {
  const data: { readonly a: 123 } = { a: 123 };
  if (isPlainObject(data)) {
    expectTypeOf(data).toEqualTypeOf<{ readonly a: 123 }>();
  }
});

test('narrows mixed records', () => {
  const data: { readonly a: 123; b: boolean } = { a: 123, b: false };
  if (isPlainObject(data)) {
    expectTypeOf(data).toEqualTypeOf<{ readonly a: 123; b: boolean }>();
  }
});

test('should work as type guard', () => {
  const data = TYPES_DATA_PROVIDER.object as AllTypesDataProviderTypes;
  if (isPlainObject(data)) {
    expectTypeOf(data).toEqualTypeOf<{ readonly a: 'asd' }>();
  }
});

test('should work even if data type is unknown', () => {
  const data = TYPES_DATA_PROVIDER.object as unknown;
  if (isPlainObject(data)) {
    expectTypeOf(data).toEqualTypeOf<Record<PropertyKey, unknown>>();
  }
});

test('should work as type guard in filter', () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isPlainObject);
  expectTypeOf(data).toEqualTypeOf<Array<{ readonly a: 'asd' }>>();
});

test('Can narrow down `any`', () => {
  // eslint-disable-next-line ts/no-explicit-any -- Explicitly testing `any`
  const data = { hello: 'world' } as any;
  if (isPlainObject(data)) {
    expectTypeOf(data).toEqualTypeOf<Record<PropertyKey, unknown>>();
  }
});
