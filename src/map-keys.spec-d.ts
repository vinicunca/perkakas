import { describe, expectTypeOf, it } from 'vitest';
import { constant } from './constant';
import { identity } from './identity';
import { mapKeys } from './map-keys';
import { pipe } from './pipe';

declare const SYMBOL: unique symbol;

describe('single bounded mapped key', () => {
  it('empty object', () => {
    expectTypeOf(mapKeys({}, constant('hello'))).toEqualTypeOf<{
      hello?: never;
    }>();
  });

  it('primitive unbounded record', () => {
    expectTypeOf(
      mapKeys({} as Record<string, string>, constant('hello')),
    ).toEqualTypeOf<{ hello?: string }>();
  });

  it('possibly empty record', () => {
    expectTypeOf(
      mapKeys({} as { a?: 'world' }, constant('hello')),
    ).toEqualTypeOf<{ hello?: 'world' }>();
  });

  it('object with single key', () => {
    expectTypeOf(mapKeys({ foo: 69 } as const, identity())).toEqualTypeOf<{
      foo: 69;
    }>();
    expectTypeOf(mapKeys({ foo: 69 } as const, constant('bar'))).toEqualTypeOf<{
      bar: 69;
    }>();
  });

  it('object with multiple keys', () => {
    expectTypeOf(mapKeys({ a: 1, b: 2 }, constant('x'))).toEqualTypeOf<{
      x: number;
    }>();
  });
});

it('simple string records', () => {
  const result = mapKeys(
    {} as Record<string, string>,
    constant('hello' as string),
  );

  expectTypeOf(result).toEqualTypeOf<Record<string, string>>();
});

it('simple number records', () => {
  const result = mapKeys({} as Record<number, number>, constant(123 as number));

  expectTypeOf(result).toEqualTypeOf<Record<number, number>>();
});

it('mapping to a string literal', () => {
  const result = mapKeys(
    {} as Record<number, number>,
    constant('cat' as 'cat' | 'dog'),
  );

  expectTypeOf(result).toEqualTypeOf<Partial<Record<'cat' | 'dog', number>>>();
});

it('symbols are not passed to the mapper', () => {
  mapKeys({ [SYMBOL]: 1, b: 'hellO', c: true }, (key, value) => {
    expectTypeOf(key).toEqualTypeOf<'b' | 'c'>();
    expectTypeOf(value).toEqualTypeOf<boolean | string>();

    return 3;
  });
});

it('symbols can be used as the return value', () => {
  expectTypeOf(mapKeys({ a: 1 }, constant(SYMBOL))).toEqualTypeOf<
    Record<typeof SYMBOL, number>
  >();
});

it('number keys are converted to strings', () => {
  mapKeys({ 123: 'abc', 456: 'def' }, (key, value) => {
    expectTypeOf(key).toEqualTypeOf<'123' | '456'>();
    expectTypeOf(value).toEqualTypeOf<string>();

    return key;
  });
});

it('numbers returned from the mapper are used as-is', () => {
  expectTypeOf(mapKeys({ a: 'b' }, constant(123))).toEqualTypeOf<
    Record<123, string>
  >();
});

it('union of records', () => {
  const data = {} as Record<PropertyKey, 'cat'> | Record<PropertyKey, 'dog'>;

  const dataFirst = mapKeys(data, constant('hello' as string));

  expectTypeOf(dataFirst).toEqualTypeOf<Record<string, 'cat' | 'dog'>>();

  const dataLast = pipe(data, mapKeys(constant('hello' as string)));

  expectTypeOf(dataLast).toEqualTypeOf<Record<string, 'cat' | 'dog'>>();
});
