import type { Tagged } from 'type-fest';
import type { IsBounded } from './is-bounded';
import { expectTypeOf, it } from 'vitest';
import { $typed } from '../../../test/$typed';

declare const SYMBOL_A: unique symbol;
// eslint-disable-next-line ts/no-unused-vars
declare const SYMBOL_B: unique symbol;

declare function isBounded<T>(data: T): IsBounded<T>;

it('string', () => {
  expectTypeOf(isBounded('')).toEqualTypeOf<false>();
});

it('number', () => {
  expectTypeOf(isBounded(1)).toEqualTypeOf<false>();
});

it('symbol', () => {
  expectTypeOf(isBounded(Symbol(''))).toEqualTypeOf<false>();
});

it('union of string, number, symbol', () => {
  expectTypeOf(isBounded($typed<string | number>())).toEqualTypeOf<false>();
  expectTypeOf(isBounded($typed<string | symbol>())).toEqualTypeOf<false>();
});

it('string literals and their union', () => {
  expectTypeOf(isBounded('a' as const)).toEqualTypeOf<true>();
  expectTypeOf(isBounded($typed<'a' | 'b'>())).toEqualTypeOf<true>();
});

it('number literals and their union', () => {
  expectTypeOf(isBounded(1 as const)).toEqualTypeOf<true>();
  expectTypeOf(isBounded($typed<1 | 2>())).toEqualTypeOf<true>();
});

it('symbol literals and their union', () => {
  expectTypeOf(isBounded(SYMBOL_A)).toEqualTypeOf<true>();
  expectTypeOf(
    isBounded(SYMBOL_A as typeof SYMBOL_A | typeof SYMBOL_B),
  ).toEqualTypeOf<true>();
});

it('unions between string, number, symbol', () => {
  expectTypeOf(isBounded($typed<'a' | 1>())).toEqualTypeOf<true>();
  expectTypeOf(
    isBounded($typed<'a' | typeof SYMBOL_A>()),
  ).toEqualTypeOf<true>();
  expectTypeOf(isBounded($typed<1 | typeof SYMBOL_A>())).toEqualTypeOf<true>();
  expectTypeOf(
    isBounded($typed<'a' | 1 | typeof SYMBOL_A>()),
  ).toEqualTypeOf<true>();
});

it('unions with unbounded types', () => {
  expectTypeOf(isBounded($typed<'a' | number>())).toEqualTypeOf<false>();
  expectTypeOf(isBounded($typed<1 | string>())).toEqualTypeOf<false>();
});

it('branded types', () => {
  expectTypeOf(isBounded('' as Tagged<string, symbol>)).toEqualTypeOf<false>();
  expectTypeOf(isBounded(1 as Tagged<number, symbol>)).toEqualTypeOf<false>();
});

it('bounded template strings', () => {
  expectTypeOf(isBounded($typed<`a_${1 | 2}`>())).toEqualTypeOf<true>();
  expectTypeOf(
    isBounded($typed<`${'a' | 'b'}_${1 | 2}`>()),
  ).toEqualTypeOf<true>();
  expectTypeOf(
    isBounded($typed<`${1 | 2}_${1 | 2}_${1 | 2}_${1 | 2}_${1 | 2}`>()),
  ).toEqualTypeOf<true>();
});

it('unbounded template strings', () => {
  expectTypeOf(isBounded($typed<`a_${number}`>())).toEqualTypeOf<false>();
  expectTypeOf(
    isBounded($typed<`${'a' | 'b'}_${number}`>()),
  ).toEqualTypeOf<false>();
  expectTypeOf(isBounded($typed<`a_${string}`>())).toEqualTypeOf<false>();
  expectTypeOf(
    isBounded($typed<`${string}_${number}_${string}_${number}_${string}`>()),
  ).toEqualTypeOf<false>();
});
