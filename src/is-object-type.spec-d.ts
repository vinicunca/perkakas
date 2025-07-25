import type { AllTypesDataProviderTypes, TestClass, TypedArray } from '../test/types-data-provider';
import { expectTypeOf, it } from 'vitest';
import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
} from '../test/types-data-provider';
import { isObjectType } from './is-object-type';

it('narrows nullable types', () => {
  const data: { a: string } | null = { a: 'hello' };
  if (isObjectType(data)) {
    expectTypeOf(data).toEqualTypeOf<{ a: string }>();
  }
});

it('should work as type guard', () => {
  const data = TYPES_DATA_PROVIDER.object as AllTypesDataProviderTypes;
  if (isObjectType(data)) {
    expectTypeOf(data).toEqualTypeOf<
      | Array<number>
      | Date
      | Error
      | Map<string, string>
      | Promise<number>
      | RegExp
      | Set<string>
      | TestClass
      | TypedArray
      | (() => void)
      | { readonly a: 'asd' }
      | [number, number, number]
    >();
  }
});

it('should work even if data type is unknown', () => {
  const data = TYPES_DATA_PROVIDER.object as unknown;
  if (isObjectType(data)) {
    expectTypeOf(data).toEqualTypeOf<object>();
  }
});

it('should work as type guard in filter', () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isObjectType);
  expectTypeOf(data).toEqualTypeOf<
    Array<
      | Array<number>
      | Date
      | Error
      | Map<string, string>
      | Promise<number>
      | RegExp
      | Set<string>
      | TestClass
      | TypedArray
      | (() => void)
      | { readonly a: 'asd' }
      | [number, number, number]
    >
  >();
});

it('can narrow down `any`', () => {
  // eslint-disable-next-line ts/no-explicit-any -- Explicitly testing `any`
  const data = { hello: 'world' } as any;
  if (isObjectType(data)) {
    expectTypeOf(data).toEqualTypeOf<object>();
  }
});
