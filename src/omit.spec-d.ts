import type { EmptyObject } from 'type-fest';
import { expectTypeOf, it } from 'vitest';
import { $typed } from '../test/$typed';
import { omit } from './omit';
import { pipe } from './pipe';

it('empty input object', () => {
  expectTypeOf(omit({} as EmptyObject, [])).toEqualTypeOf<EmptyObject>();
});

it('empty keys tuple', () => {
  expectTypeOf(omit({ a: 1, b: 2 }, [] as const)).toEqualTypeOf<{
    a: number;
    b: number;
  }>();
});

it('simple bounded object and keys tuple', () => {
  expectTypeOf(omit({ a: 1, b: 2 }, ['a'])).toEqualTypeOf<{ b: number }>();
});

it('union data with common omitted prop', () => {
  expectTypeOf(
    omit({ a: 1 } as { a: number } | { a?: number; b: string }, ['a']),
  ).toEqualTypeOf<EmptyObject | { b: string }>();
});

it('union data with distinct omitted props on all elements', () => {
  expectTypeOf(
    omit({ a: 'hello' } as { a: string } | { b: string }, ['a', 'b']),
  ).toEqualTypeOf<EmptyObject>();
});

it('union data with distinct omitted prop on a single element', () => {
  expectTypeOf(
    omit({ a: 'hello' } as { a: string } | { b: string }, ['a']),
  ).toEqualTypeOf<EmptyObject | { b: string }>();
});

it('omit everything', () => {
  expectTypeOf(
    omit({ a: 'hello', b: 'world' }, ['a', 'b']),
  ).toEqualTypeOf<EmptyObject>();
});

it('omit unbounded', () => {
  expectTypeOf(
    omit({} as Record<string, string>, [$typed<string>()]),
  ).toEqualTypeOf<Record<string, string>>();
});

it('omit bounded from unbounded', () => {
  expectTypeOf(omit({} as Record<string, string>, ['a'])).toEqualTypeOf<{
    [key: string]: string;
    a: never;
  }>();
});

it('data-last', () => {
  expectTypeOf(
    pipe({ a: 1 } as { a: number } | { a?: number; b: string }, omit(['a'])),
  ).toEqualTypeOf<EmptyObject | { b: string }>();
});

it('unbounded keys with simple array', () => {
  expectTypeOf(
    omit({} as Record<string, number>, [] as Array<string>),
  ).toEqualTypeOf<Record<string, number>>();
});

it('readonly data becomes writable', () => {
  expectTypeOf(omit({ a: 1, b: 2 } as const, ['a'])).toEqualTypeOf<{ b: 2 }>();
});

it('keys with union type', () => {
  expectTypeOf(
    omit({ a: 1, b: 2, c: 3 }, [$typed<'a' | 'b'>()]),
  ).toEqualTypeOf<{
    a?: number;
    b?: number;
    c: number;
  }>();
});

it('non existing prop', () => {
  // @ts-expect-error [ts2322] -- should not allow non existing props
  omit({ a: 1, b: 2, c: 3, d: 4 }, ['not', 'in'] as const);
});
