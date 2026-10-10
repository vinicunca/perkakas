import type { Tagged } from 'type-fest';
import type { EnumerableStringKeyOf } from './enumerable-string-key-of';
import { expectTypeOf, it } from 'vitest';
import { $typed } from '../../../test/$typed';

declare const SYMBOL: unique symbol;

declare function enumerableStringKeyOf<T>(data: T): EnumerableStringKeyOf<T>;

it('string keys', () => {
  expectTypeOf(
    enumerableStringKeyOf($typed<Record<string, unknown>>()),
  ).toEqualTypeOf<string>();
});

it('number keys', () => {
  expectTypeOf(
    enumerableStringKeyOf($typed<Record<number, unknown>>()),
  ).toEqualTypeOf<`${number}`>();
});

it('union of records', () => {
  expectTypeOf(
    enumerableStringKeyOf(
      $typed<Record<`prefix_${string}`, unknown> | Record<number, unknown>>(),
    ),
  ).toEqualTypeOf<`${number}` | `prefix_${string}`>();
});

it('union keys', () => {
  expectTypeOf(
    enumerableStringKeyOf(
      $typed<Record<number | `prefix_${string}`, unknown>>(),
    ),
  ).toEqualTypeOf<`${number}` | `prefix_${string}`>();
});

it('union of records with branded keys', () => {
  expectTypeOf(
    enumerableStringKeyOf(
      $typed<
        | Record<Tagged<string, 'coke'>, unknown>
        | Record<Tagged<string, 'pepsi'>, unknown>
      >(),
    ),
  ).toEqualTypeOf<Tagged<string, 'coke'> | Tagged<string, 'pepsi'>>();
});

it('union of branded keys', () => {
  expectTypeOf(
    enumerableStringKeyOf(
      {} as Record<Tagged<string, 'coke'> | Tagged<string, 'pepsi'>, unknown>,
    ),
  ).toEqualTypeOf<Tagged<string, 'coke'> | Tagged<string, 'pepsi'>>();
});

it('union with a mix of branded and number keys', () => {
  expectTypeOf(
    enumerableStringKeyOf(
      $typed<Record<Tagged<string, 'brand'> | number, unknown>>(),
    ),
  ).toEqualTypeOf<Tagged<string, 'brand'> | `${number}`>();
});

it('union of records with branded key and number key', () => {
  expectTypeOf(
    enumerableStringKeyOf(
      $typed<
        Record<Tagged<string, 'brand'>, unknown> | Record<number, unknown>
      >(),
    ),
  ).toEqualTypeOf<Tagged<string, 'brand'> | `${number}`>();
});

it('symbol keys', () => {
  expectTypeOf(
    enumerableStringKeyOf($typed<Record<string | symbol, unknown>>()),
  ).toEqualTypeOf<string>();

  expectTypeOf(
    enumerableStringKeyOf({ [SYMBOL]: 'hello', a: 'world' }),
  ).toEqualTypeOf<'a'>();

  expectTypeOf(
    enumerableStringKeyOf({} as Record<string | typeof SYMBOL, unknown>),
  ).toEqualTypeOf<string>();
});

it('optional keys', () => {
  expectTypeOf(
    enumerableStringKeyOf($typed<{ a: unknown; b?: unknown }>()),
  ).toEqualTypeOf<'a' | 'b'>();
});

it('branded types', () => {
  expectTypeOf(
    enumerableStringKeyOf({} as Record<Tagged<string, 'brand'>, unknown>),
  ).toEqualTypeOf<Tagged<string, 'brand'>>();
});
