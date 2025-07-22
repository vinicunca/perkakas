/* eslint-disable style/indent */
import type { AllTypesDataProviderTypes, TestClass, TypedArray } from '../test/types-data-provider';
import { expectTypeOf, it } from 'vitest';
import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
} from '../test/types-data-provider';
import { isNot } from './is-not';
import { isPromise } from './is-promise';
import { isString } from './is-string';

it('should work as type guard', () => {
  const data = TYPES_DATA_PROVIDER.promise as AllTypesDataProviderTypes;
  if (isNot(isString)(data)) {
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
      | symbol
      | 1n
      | (() => void)
      | { readonly a: 'asd' }
      | [number, number, number]
      | null
      | undefined
    >(data);
  }
});

it('should work as type guard in filter', () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isNot(isPromise));
  expectTypeOf(data).toEqualTypeOf<
    Array<
      | Array<number>
      | Date
      | Error
      | Map<string, string>
      | RegExp
      | Set<string>
      | TestClass
      | TypedArray
      | boolean
      | number
      | string
      | symbol
      | 1n
      | (() => void)
      | { readonly a: 'asd' }
      | [number, number, number]
      | null
      | undefined
    >
  >();
});
