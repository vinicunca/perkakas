import type { EmptyObject } from 'type-fest';
import type { EnumerableStringKeyedValueOf } from './enumerable-string-keyed-value-of';
import { expectTypeOf, it } from 'vitest';

declare function enumerableStringKeyedValueOf<const T>(
  data: T,
): EnumerableStringKeyedValueOf<T>;

const SymbolFoo = Symbol('foo');

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
    enumerableStringKeyedValueOf({ [SymbolFoo]: 'hello' } as const),
  ).toEqualTypeOf<never>();

  expectTypeOf(
    enumerableStringKeyedValueOf({ [SymbolFoo]: 'hello', b: '1' } as const),
  ).toEqualTypeOf<'1'>();

  expectTypeOf(
    enumerableStringKeyedValueOf(
      {} as Record<PropertyKey | typeof SymbolFoo, string>,
    ),
  ).toEqualTypeOf<string>();
});

it('empty object', () => {
  expectTypeOf(
    enumerableStringKeyedValueOf({} as EmptyObject),
  ).toEqualTypeOf<never>();
});

it('parameterized record key', () => {
  // @ts-expect-error [ts6133] -- Only functions allow us to define a parametrized record (I think...)
  // eslint-disable-next-line ts/no-unused-vars, unused-imports/no-unused-vars, sonar/no-dead-store -- The function inside this test IS the main point of the test and can't be pulled out or used.
  const foo = <K extends string>(data: Record<K, { a: 'hello' }>): void => {
    // TypeScript/Vitest (?!) is failing to infer the result of our function
    // on this type directly, but still manages to typecheck it once we
    // destructure the result and only test the type of the property. I don't
    // know why that is and if there's any better more idiomatic way to do this.
    const { a } = enumerableStringKeyedValueOf(data);

    expectTypeOf(a).toEqualTypeOf<'hello'>();
  };
});
