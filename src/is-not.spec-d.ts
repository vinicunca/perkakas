/* eslint-disable sonar/no-ignored-return */
import type { AllTypesDataProviderTypes, TestClass, TypedArray } from '../test/types-data-provider';
import { describe, expectTypeOf, it, test } from 'vitest';
import { $typed } from '../test/$typed';
import {
  ALL_TYPES_DATA_PROVIDER,

  TYPES_DATA_PROVIDER,
} from '../test/types-data-provider';
import { constant } from './constant';
import { filter } from './filter';
import { isNot } from './is-not';
import { isNullish } from './is-nullish';
import { isPromise } from './is-promise';
import { isString } from './is-string';
import { isTruthy } from './is-truthy';
import { startsWith } from './starts-with';

test('should work as type guard', () => {
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
      | [number, number, number]
      | { readonly a: 'asd' }
      | null
      | undefined
    >(data);
  }
});

test('should work as type guard in filter', () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isNot(isPromise));

  expectTypeOf(data).toEqualTypeOf<
    Array<Array<number>
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
    | [number, number, number]
    | { readonly a: 'asd' }
    | null
    | undefined>
  >();
});

test('negates a predicate wider than the data', () => {
  expectTypeOf(
    $typed<Array<string | null>>().filter(
      isNot(
        (x: unknown): x is null | undefined => x === null || x === undefined,
      ),
    ),
  ).items.toEqualTypeOf<string>();
});

test('type predicates that take a type parameter', () => {
  expectTypeOf(
    $typed<Array<boolean>>().filter(isNot(isTruthy)),
  ).items.toEqualTypeOf<false>();
});

test('type predicates which are too narrow for the wrapper', () => {
  $typed<Array<string | number>>().filter(
    // @ts-expect-error [ts2769] -- Intentional! This is what we want to test
    // here. The `number` in the data type cannot be processed by the type
    // predicate.
    isNot(startsWith('hello')),
  );
});

test('type predicates which are disjoint for the wrapper', () => {
  $typed<Array<number>>().filter(
    // @ts-expect-error [ts2769] -- Intentional! This is what we want to test
    // here. The `number` in the data type cannot be processed by the type
    // predicate.
    isNot(startsWith('hello')),
  );
});

test('negates a generic guard', () => {
  expectTypeOf(
    $typed<Array<string | null>>().filter(isNot(isNullish)),
  ).items.toEqualTypeOf<string>();
});

test('non-narrowing predicates stay non-narrowing', () => {
  expectTypeOf(
    $typed<Array<string>>().filter(isNot((data: string) => data.length > 3)),
  ).items.toEqualTypeOf<string>();
});

describe('trivial constant predicates', () => {
  it('flips an always-true predicate', () => {
    expectTypeOf(isNot(constant(true))).returns.toEqualTypeOf<false>();
  });

  it('flips an always-false predicate', () => {
    expectTypeOf(isNot(constant(false))).returns.toEqualTypeOf<true>();
  });

  it('always-true predicate empties a filtering consumer', () => {
    expectTypeOf(filter([] as Array<string>, isNot(constant(true)))).toEqualTypeOf<
      []
    >();
  });

  it('involution', () => {
    expectTypeOf(isNot(isNot(constant(true)))).returns.toEqualTypeOf<true>();
    expectTypeOf(isNot(isNot(constant(false)))).returns.toEqualTypeOf<false>();
  });
});
