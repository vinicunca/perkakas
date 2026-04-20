import type { AllTypesDataProviderTypes, TestClass, TypedArray } from '../test/types-data-provider';
import { expectTypeOf, it } from 'vitest';
import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
} from '../test/types-data-provider';
import { isFunction } from './is-function';

declare const DATA: string | ((a: number) => string) | undefined;

it('should work as type guard', () => {
  const data = TYPES_DATA_PROVIDER.function as AllTypesDataProviderTypes;

  if (isFunction(data)) {
    expectTypeOf(data).toEqualTypeOf<() => void>();
  } else {
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
      | boolean
      | number
      | string
      | symbol
      | 1n
      | { readonly a: 'asd' }
      | [number, number, number]
      | null
      | undefined
    >();
  }
});

it('union with non-function types', () => {
  if (isFunction(DATA)) {
    expectTypeOf(DATA).toEqualTypeOf<(a: number) => string>();
  } else {
    expectTypeOf(DATA).toEqualTypeOf<string | undefined>();
  }
});

it('should work as type guard in filter', () => {
  expectTypeOf(ALL_TYPES_DATA_PROVIDER.filter(isFunction)).toEqualTypeOf<
    Array<() => void>
  >();
});

it('unknown', () => {
  const data = 'Hello, world!' as unknown;

  if (isFunction(data)) {
    expectTypeOf(data).toEqualTypeOf<(...args: never) => unknown>();
  } else {
    expectTypeOf(data).toEqualTypeOf<unknown>();
  }
});

it('any', () => {
  // eslint-disable-next-line ts/no-explicit-any -- Intentional!
  const data = 'Hello, world!' as any;

  if (isFunction(data)) {
    expectTypeOf(data).toEqualTypeOf<(...args: never) => unknown>();
  } else {
    // eslint-disable-next-line ts/no-explicit-any
    expectTypeOf(data).toEqualTypeOf<any>();
  }
});
