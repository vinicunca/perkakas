import { expectTypeOf, it } from 'vitest';
import { constant } from './constant';
import { mapKeys } from './map-keys';
import { pipe } from './pipe';

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
  mapKeys({ [Symbol('mySymbol')]: 1, b: 'hellO', c: true }, (key, value) => {
    expectTypeOf(key).toEqualTypeOf<'b' | 'c'>();
    expectTypeOf(value).toEqualTypeOf<boolean | string>();

    return 3;
  });
});

it('symbols can be used as the return value', () => {
  const mySymbol = Symbol('mySymbol');
  const result = mapKeys({ a: 1 }, constant(mySymbol));

  expectTypeOf(result).toEqualTypeOf<
    Partial<Record<typeof mySymbol, number>>
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
    Partial<Record<123, string>>
  >();
});

it('union of records', () => {
  const data = {} as Record<PropertyKey, 'cat'> | Record<PropertyKey, 'dog'>;

  const dataFirst = mapKeys(data, constant('hello' as string));

  expectTypeOf(dataFirst).toEqualTypeOf<Record<string, 'cat' | 'dog'>>();

  const dataLast = pipe(data, mapKeys(constant('hello' as string)));

  expectTypeOf(dataLast).toEqualTypeOf<Record<string, 'cat' | 'dog'>>();
});
