import type { StringLength } from './string-length';
import { expectTypeOf, it } from 'vitest';

declare function stringLength<S extends string>(data: S): StringLength<S>;

it('empty string', () => {
  expectTypeOf(stringLength('')).toEqualTypeOf<0>();
});

it('simple string', () => {
  expectTypeOf(stringLength('hello')).toEqualTypeOf<5>();
});

it('union of simple strings', () => {
  expectTypeOf(stringLength('hello' as 'cat' | 'elephant')).toEqualTypeOf<
    3 | 8
  >();
});

it('primitive string', () => {
  expectTypeOf(stringLength('hello' as string)).toEqualTypeOf<number>();
});

it('bounded template string', () => {
  expectTypeOf(stringLength('h1' as `h${1 | 22 | 333}`)).toEqualTypeOf<
    2 | 3 | 4
  >();
});

it('unbounded template string', () => {
  expectTypeOf(stringLength('hello' as `h${string}`)).toEqualTypeOf<number>();
});

it('union of bounded and unbounded string', () => {
  expectTypeOf(
    stringLength('hello' as `h${1 | 22 | 333}` | `h${string}`),
  ).toEqualTypeOf<number>();
});
