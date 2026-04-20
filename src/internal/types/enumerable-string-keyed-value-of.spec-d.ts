import type { EmptyObject } from 'type-fest';
import type { EnumerableStringKeyedValueOf } from './enumerable-string-keyed-value-of';
import { expectTypeOf, it } from 'vitest';

declare const SYMBOL: unique symbol;

declare function enumerableStringKeyedValueOf<const T>(
  data: T,
): EnumerableStringKeyedValueOf<T>;

it('string values', () => {
  expectTypeOf(
    enumerableStringKeyedValueOf({} as Record<PropertyKey, string>),
  ).toEqualTypeOf<string>();
});

it('number values', () => {
  expectTypeOf(
    enumerableStringKeyedValueOf({} as Record<PropertyKey, number>),
  ).toEqualTypeOf<number>();
});

it('union of records', () => {
  expectTypeOf(
    enumerableStringKeyedValueOf(
      {} as Record<PropertyKey, 'cat'> | Record<PropertyKey, 'dog'>,
    ),
  ).toEqualTypeOf<'cat' | 'dog'>();

  expectTypeOf(
    enumerableStringKeyedValueOf(
      {} as Record<PropertyKey, number> | Record<PropertyKey, string>,
    ),
  ).toEqualTypeOf<number | string>();
});

it('union values', () => {
  expectTypeOf(
    enumerableStringKeyedValueOf({} as Record<PropertyKey, number | string>),
  ).toEqualTypeOf<number | string>();
});

it('literal values', () => {
  expectTypeOf(
    enumerableStringKeyedValueOf({ a: 1 } as const),
  ).toEqualTypeOf<1>();

  expectTypeOf(
    enumerableStringKeyedValueOf({ a: 1 } as { a: '1' | '2' | 1 }),
  ).toEqualTypeOf<'1' | '2' | 1>();
});

it('optional values', () => {
  expectTypeOf(
    enumerableStringKeyedValueOf({ a: 1 } as { a: 1; b?: 4 }),
  ).toEqualTypeOf<1 | 4>();

  expectTypeOf(
    enumerableStringKeyedValueOf({ a: 'hello' } as { a: string; b?: number }),
  ).toEqualTypeOf<number | string>();
});

it('nullish and undefined values', () => {
  expectTypeOf(
    enumerableStringKeyedValueOf({ a: 'hello', b: 'world' } as {
      a: string | undefined;
      b: string | null;
    }),
  ).toEqualTypeOf<string | null | undefined>();

  expectTypeOf(
    enumerableStringKeyedValueOf(
      {} as {
        a?: number | null;
        b?: number | null | undefined;
      },
    ),
  ).toEqualTypeOf<number | null | undefined>();
});

it('symbol keys', () => {
  expectTypeOf(
    enumerableStringKeyedValueOf({ [SYMBOL]: 'hello' } as const),
  ).toEqualTypeOf<never>();

  expectTypeOf(
    enumerableStringKeyedValueOf({ [SYMBOL]: 'hello', b: '1' } as const),
  ).toEqualTypeOf<'1'>();

  expectTypeOf(
    enumerableStringKeyedValueOf(
      {} as Record<PropertyKey | typeof SYMBOL, string>,
    ),
  ).toEqualTypeOf<string>();
});

it('empty object', () => {
  expectTypeOf(
    enumerableStringKeyedValueOf({} as EmptyObject),
  ).toEqualTypeOf<never>();
});

it('parameterized record key', () => {
  const foo = <K extends string>(data: Record<K, { a: 'hello' }>): void => {
    // Because of the type parameter TypeScript doesn't infer the concrete
    // return type here, preventing us from being able to compare it to an
    // expected type (that doesn't use EnumerableStringKeyedValueOf itself);
    // but once we treat it as an object by accessing a specific property
    // TypeScript attempts to eagerly infer it (and succeeds). This provides us
    // a good enough workaround for testing the expected type.
    // @see https://github.com/microsoft/TypeScript/issues/48810
    const { a } = enumerableStringKeyedValueOf(data);

    expectTypeOf(a).toEqualTypeOf<'hello'>();
  };

  // We need to "use" the function above to prevent GitHub's CodeQL from
  // surfacing it as unused (`js/unused-local-variable`), which it technically
  // is, albeit this being a **type test** where execution is meaningless to
  // begin with...
  // eslint-disable-next-line sonar/void-use
  void foo;
});
