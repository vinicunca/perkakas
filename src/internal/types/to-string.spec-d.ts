import type { Tagged } from 'type-fest';
import type { ToString } from './to-string';
import { describe, expectTypeOf, it } from 'vitest';

declare function toString<const T>(data: T): ToString<T>;

it('primitive strings', () => {
  expectTypeOf(toString('' as string)).toEqualTypeOf<string>();
});

it('literal string', () => {
  expectTypeOf(toString('hello')).toEqualTypeOf<'hello'>();
});

it('primitive numbers', () => {
  expectTypeOf(toString(123 as number)).toEqualTypeOf<`${number}`>();
});

it('literal number', () => {
  expectTypeOf(toString(123)).toEqualTypeOf<'123'>();
});

it('template string', () => {
  expectTypeOf(
    toString('prefix_123' as `prefix_${number}`),
  ).toEqualTypeOf<`prefix_${number}`>();
});

it('union of literal numbers', () => {
  expectTypeOf(toString(123 as 123 | 456)).toEqualTypeOf<'123' | '456'>();
});

it('union of number and template string', () => {
  expectTypeOf(toString(123 as number | `prefix_${number}`)).toEqualTypeOf<
    `${number}` | `prefix_${number}`
  >();
});

it('branded type', () => {
  expectTypeOf(toString('hello' as Tagged<string, 'greeting'>)).toEqualTypeOf<
    Tagged<string, 'greeting'>
  >();
});

it('union of branded types', () => {
  expectTypeOf(
    toString('cola' as Tagged<string, 'coke'> | Tagged<string, 'pepsi'>),
  ).toEqualTypeOf<Tagged<string, 'coke'> | Tagged<string, 'pepsi'>>();
});

it('union with a mix of branded and number keys', () => {
  expectTypeOf(toString(123 as 123 | Tagged<string, 'brand'>)).toEqualTypeOf<
    '123' | Tagged<string, 'brand'>
  >();
});

describe('symbols', () => {
  it('primitive', () => {
    expectTypeOf(toString(Symbol('foo'))).toEqualTypeOf<never>();
  });

  it('union with primitive string', () => {
    expectTypeOf(toString('hello' as string | symbol)).toEqualTypeOf<string>();
  });

  it('union with primitive number', () => {
    expectTypeOf(toString(123 as number | symbol)).toEqualTypeOf<`${number}`>();
  });

  it('union with literal number', () => {
    expectTypeOf(toString(123 as 123 | symbol)).toEqualTypeOf<'123'>();
  });

  it('union with template string', () => {
    expectTypeOf(
      toString('prefix_123' as `prefix_${number}` | symbol),
    ).toEqualTypeOf<`prefix_${number}`>();
  });

  it('union with branded type', () => {
    expectTypeOf(
      toString('hello' as Tagged<string, 'greeting'> | symbol),
    ).toEqualTypeOf<Tagged<string, 'greeting'>>();
  });
});
