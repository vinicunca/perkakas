import type { WidePropertyKey } from './wide-property-key';
import { expectTypeOf, it } from 'vitest';
import { $typed } from '../../../test/$typed';

declare const UNIQUE_SYMBOL: unique symbol;

declare function widePropertyKey<Key extends PropertyKey>(
  key: Key,
): WidePropertyKey<Key>;

it('string', () => {
  expectTypeOf(widePropertyKey($typed<string>())).toEqualTypeOf<string>();
});

it('number', () => {
  expectTypeOf(widePropertyKey($typed<number>())).toEqualTypeOf<number>();
});

it('symbol', () => {
  expectTypeOf(widePropertyKey($typed<symbol>())).toEqualTypeOf<symbol>();
});

it('literal', () => {
  expectTypeOf(widePropertyKey('a')).toBeNever();
});

it('union of literals', () => {
  expectTypeOf(widePropertyKey($typed<'a' | 1>())).toBeNever();
});

it('template literal', () => {
  expectTypeOf(widePropertyKey($typed<`data-${string}`>())).toBeNever();
});

it('wide key in a union', () => {
  expectTypeOf(widePropertyKey($typed<'a' | number>())).toEqualTypeOf<number>();
});

it('unique symbol', () => {
  expectTypeOf(widePropertyKey(UNIQUE_SYMBOL)).toBeNever();
});

it('string takes precedence', () => {
  expectTypeOf(
    widePropertyKey($typed<number | string>()),
  ).toEqualTypeOf<string>();
});
