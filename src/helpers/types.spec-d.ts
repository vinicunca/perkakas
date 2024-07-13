import type { EmptyObject } from 'type-fest';

import type {
  Branded,
  EnumerableStringKeyOf,
  EnumerableStringKeyedValueOf,
  IfBoundedRecord,
} from './types';

declare const SymbolFoo: unique symbol;
declare const SymbolBar: unique symbol;

describe('ifBoundedRecord', () => {
  it('string', () => {
    expectTypeOf<
      IfBoundedRecord<Record<string, unknown>>
    >().toEqualTypeOf<false>();

    expectTypeOf<
      IfBoundedRecord<Partial<Record<string, unknown>>>
    >().toEqualTypeOf<false>();
  });

  it('number', () => {
    expectTypeOf<
      IfBoundedRecord<Record<number, unknown>>
    >().toEqualTypeOf<false>();

    expectTypeOf<
      IfBoundedRecord<Partial<Record<number, unknown>>>
    >().toEqualTypeOf<false>();
  });

  it('symbol', () => {
    expectTypeOf<
      IfBoundedRecord<Record<symbol, unknown>>
    >().toEqualTypeOf<false>();

    expectTypeOf<
      IfBoundedRecord<Partial<Record<symbol, unknown>>>
    >().toEqualTypeOf<false>();
  });

  it('union of string, number, symbol', () => {
    expectTypeOf<
      IfBoundedRecord<Record<number | string, unknown>>
    >().toEqualTypeOf<false>();

    expectTypeOf<
      IfBoundedRecord<Record<string | symbol, unknown>>
    >().toEqualTypeOf<false>();
  });

  it('string literals and their union', () => {
    expectTypeOf<IfBoundedRecord<Record<'a', unknown>>>().toEqualTypeOf<true>();

    expectTypeOf<
      IfBoundedRecord<Record<'a' | 'b', unknown>>
    >().toEqualTypeOf<true>();
  });

  it('number literals and their union', () => {
    expectTypeOf<IfBoundedRecord<Record<1, unknown>>>().toEqualTypeOf<true>();

    expectTypeOf<
      IfBoundedRecord<Record<1 | 2, unknown>>
    >().toEqualTypeOf<true>();
  });

  it('symbol literals and their union', () => {
    expectTypeOf<
      IfBoundedRecord<Record<typeof SymbolFoo, unknown>>
    >().toEqualTypeOf<true>();

    expectTypeOf<
      IfBoundedRecord<Record<typeof SymbolBar | typeof SymbolFoo, unknown>>
    >().toEqualTypeOf<true>();
  });

  it('unions between string, number, symbol', () => {
    expectTypeOf<
      IfBoundedRecord<Record<'a' | 1, unknown>>
    >().toEqualTypeOf<true>();

    expectTypeOf<
      IfBoundedRecord<Record<'a' | typeof SymbolFoo, unknown>>
    >().toEqualTypeOf<true>();

    expectTypeOf<
      IfBoundedRecord<Record<1 | typeof SymbolFoo, unknown>>
    >().toEqualTypeOf<true>();

    expectTypeOf<
      IfBoundedRecord<Record<'a' | 1 | typeof SymbolFoo, unknown>>
    >().toEqualTypeOf<true>();

    expectTypeOf<
      IfBoundedRecord<{ 1: number } | { a: string; [SymbolFoo]: number }>
    >().toEqualTypeOf<true>();

    expectTypeOf<
      IfBoundedRecord<{ 1?: number } | { a?: string; [SymbolFoo]: number }>
    >().toEqualTypeOf<true>();
  });

  it('unions with unbounded types', () => {
    expectTypeOf<
      IfBoundedRecord<Record<'a' | number, unknown>>
    >().toEqualTypeOf<false>();

    expectTypeOf<
      IfBoundedRecord<Record<1 | string, unknown>>
    >().toEqualTypeOf<false>();

    expectTypeOf<
      IfBoundedRecord<Record<1, unknown> | Record<string, unknown>>
    >().toEqualTypeOf<false>();
  });

  it('branded types', () => {
    expectTypeOf<
      IfBoundedRecord<Record<Branded<string, symbol>, unknown>>
    >().toEqualTypeOf<false>();

    expectTypeOf<
      IfBoundedRecord<Record<Branded<number, symbol>, unknown>>
    >().toEqualTypeOf<false>();
  });

  it('bounded template strings', () => {
    expectTypeOf<
      IfBoundedRecord<Record<`a_${1 | 2}`, unknown>>
    >().toEqualTypeOf<true>();

    expectTypeOf<
      IfBoundedRecord<Record<`${'a' | 'b'}_${1 | 2}`, unknown>>
    >().toEqualTypeOf<true>();

    expectTypeOf<
      IfBoundedRecord<
        Record<`${1 | 2}_${1 | 2}_${1 | 2}_${1 | 2}_${1 | 2}`, unknown>
      >
    >().toEqualTypeOf<true>();
  });

  it('unbounded template strings', () => {
    expectTypeOf<
      IfBoundedRecord<Record<`a_${number}`, unknown>>
    >().toEqualTypeOf<false>();

    expectTypeOf<
      IfBoundedRecord<Record<`${'a' | 'b'}_${number}`, unknown>>
    >().toEqualTypeOf<false>();

    expectTypeOf<
      IfBoundedRecord<Record<`a_${string}`, unknown>>
    >().toEqualTypeOf<false>();

    expectTypeOf<
      IfBoundedRecord<
        Record<`${string}_${number}_${string}_${number}_${string}`, unknown>
      >
    >().toEqualTypeOf<false>();
  });
});

describe('enumerableStringKeyOf', () => {
  it('string keys', () => {
    expectTypeOf<
      EnumerableStringKeyOf<Record<string, unknown>>
    >().toEqualTypeOf<string>();
  });

  it('number keys', () => {
    expectTypeOf<
      EnumerableStringKeyOf<Record<number, unknown>>
    >().toEqualTypeOf<`${number}`>();
  });

  it('union of records', () => {
    expectTypeOf<
      EnumerableStringKeyOf<
        Record<`prefix_${string}`, unknown> | Record<number, unknown>
      >
    >().toEqualTypeOf<`${number}` | `prefix_${string}`>();
  });

  it('union keys', () => {
    expectTypeOf<
      EnumerableStringKeyOf<Record<`prefix_${string}` | number, unknown>>
    >().toEqualTypeOf<`${number}` | `prefix_${string}`>();
  });

  it('symbol keys', () => {
    expectTypeOf<
      EnumerableStringKeyOf<Record<string | symbol, unknown>>
    >().toEqualTypeOf<string>();

    expectTypeOf<
      EnumerableStringKeyOf<{ [SymbolFoo]: number; a: unknown }>
    >().toEqualTypeOf<'a'>();

    expectTypeOf<
      EnumerableStringKeyOf<Record<string | typeof SymbolFoo, unknown>>
    >().toEqualTypeOf<string>();
  });

  it('optional keys', () => {
    expectTypeOf<
      EnumerableStringKeyOf<{ a: unknown; b?: unknown }>
    >().toEqualTypeOf<'a' | 'b'>();
  });

  it('branded types', () => {
    expectTypeOf<
      EnumerableStringKeyOf<Record<Branded<string, symbol>, unknown>>
    >().toEqualTypeOf<`${Branded<string, symbol>}`>();
  });
});

describe('enumerableStringKeyedValueOf', () => {
  it('string values', () => {
    expectTypeOf<
      EnumerableStringKeyedValueOf<Record<PropertyKey, string>>
    >().toEqualTypeOf<string>();
  });

  it('number values', () => {
    expectTypeOf<
      EnumerableStringKeyedValueOf<Record<PropertyKey, number>>
    >().toEqualTypeOf<number>();
  });

  it('union of records', () => {
    expectTypeOf<
      EnumerableStringKeyedValueOf<
        Record<PropertyKey, 'cat'> | Record<PropertyKey, 'dog'>
      >
    >().toEqualTypeOf<'cat' | 'dog'>();

    expectTypeOf<
      EnumerableStringKeyedValueOf<
        Record<PropertyKey, number> | Record<PropertyKey, string>
      >
    >().toEqualTypeOf<number | string>();
  });

  it('union values', () => {
    expectTypeOf<
      EnumerableStringKeyedValueOf<Record<PropertyKey, number | string>>
    >().toEqualTypeOf<number | string>();
  });

  it('literal values', () => {
    expectTypeOf<EnumerableStringKeyedValueOf<{ a: 1 }>>().toEqualTypeOf<1>();

    expectTypeOf<
      EnumerableStringKeyedValueOf<{ a: '1' | '2' | 1 }>
    >().toEqualTypeOf<'1' | '2' | 1>();
  });

  it('optional values', () => {
    expectTypeOf<EnumerableStringKeyedValueOf<{ a: 1; b?: 4 }>>().toEqualTypeOf<
      1 | 4
    >();

    expectTypeOf<
      EnumerableStringKeyedValueOf<{ a: string; b?: number }>
    >().toEqualTypeOf<number | string>();
  });

  it('nullish and undefined values', () => {
    expectTypeOf<
      EnumerableStringKeyedValueOf<{
        a: string | undefined;
        b: null | string;
      }>
    >().toEqualTypeOf<null | string | undefined>();

    expectTypeOf<
      EnumerableStringKeyedValueOf<{
        a?: null | number;
        b?: null | number | undefined;
      }>
    >().toEqualTypeOf<null | number | undefined>();
  });

  it('symbol keys', () => {
    expectTypeOf<
      EnumerableStringKeyedValueOf<{ [SymbolFoo]: string }>
    >().toEqualTypeOf<never>();

    expectTypeOf<
      EnumerableStringKeyedValueOf<{ [SymbolFoo]: string; b: '1' }>
    >().toEqualTypeOf<'1'>();

    expectTypeOf<
      EnumerableStringKeyedValueOf<
        Record<PropertyKey | typeof SymbolFoo, string>
      >
    >().toEqualTypeOf<string>();
  });

  it('empty object', () => {
    expectTypeOf<
      EnumerableStringKeyedValueOf<EmptyObject>
    >().toEqualTypeOf<never>();
  });
});
