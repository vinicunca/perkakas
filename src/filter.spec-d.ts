import { describe, expectTypeOf, it } from 'vitest';
import { constant } from './constant';
import { filter } from './filter';
import { isDefined } from './is-defined';
import { isNonNull } from './is-non-null';
import { isNonNullish } from './is-non-nullish';
import { isStrictEqual } from './is-strict-equal';
import { pipe } from './pipe';

// TODO [>2]: Our type-narrowing utilities aren't narrowing our types correctly in these tests due to them inferring the types "too soon" (because they are invoked "headless"ly). This is also a problem with TypeScript before version 5.5 because we can't use a simple arrow function too without being explicit about it's return type, which makes the whole code messy. In v2 we plan to bump the minimum TypeScript version so this wouldn't be an issue any way, but we also plan to deprecate headless type predicates.
declare function isNumber<T>(x: T): x is Extract<T, number>;
declare function isString<T>(x: T): x is Extract<T, string>;

describe('primitives arrays', () => {
  it('predicate', () => {
    expectTypeOf(filter([] as Array<string>, constant(true))).toEqualTypeOf<
      Array<string>
    >();
  });

  it('trivial acceptor', () => {
    expectTypeOf(
      filter([] as Array<string>, constant(true as const)),
    ).toEqualTypeOf<Array<string>>();
  });

  it('trivial rejector', () => {
    expectTypeOf(
      filter([] as Array<string>, constant(false as const)),
    ).toEqualTypeOf<[]>();
  });

  it('type predicate', () => {
    expectTypeOf(
      filter([] as Array<string>, isStrictEqual('hello' as const)),
    ).toEqualTypeOf<Array<'hello'>>();
  });

  it('type predicate of the same type as the array', () => {
    expectTypeOf(filter([] as Array<string>, isString)).toEqualTypeOf<
      Array<string>
    >();
  });
});

describe('arrays with literal unions', () => {
  it('predicate', () => {
    expectTypeOf(
      filter([] as Array<'cat' | 'dog'>, constant(true)),
    ).toEqualTypeOf<Array<'cat' | 'dog'>>();
  });

  it('trivial acceptor', () => {
    expectTypeOf(
      filter([] as Array<'cat' | 'dog'>, constant(true as const)),
    ).toEqualTypeOf<Array<'cat' | 'dog'>>();
  });

  it('trivial rejector', () => {
    expectTypeOf(
      filter([] as Array<'cat' | 'dog'>, constant(false as const)),
    ).toEqualTypeOf<[]>();
  });

  it('type predicate', () => {
    expectTypeOf(
      filter([] as Array<'cat' | 'dog'>, isStrictEqual('cat' as const)),
    ).toEqualTypeOf<Array<'cat'>>();
  });
});

describe('fixed tuple', () => {
  it('predicate', () => {
    expectTypeOf(
      filter(
        ['hello', 'world', 1, 2, 3, true, 'world', 3, 'hello'] as const,
        constant(true),
      ),
    ).toEqualTypeOf<Array<true | 1 | 2 | 3 | 'hello' | 'world'>>();
  });

  it('trivial acceptor', () => {
    expectTypeOf(
      filter(
        ['hello', 'world', 1, 2, 3, true, 'world', 3, 'hello'] as const,
        constant(true as const),
      ),
    ).toEqualTypeOf<['hello', 'world', 1, 2, 3, true, 'world', 3, 'hello']>();
  });

  it('trivial rejector', () => {
    expectTypeOf(
      filter(
        ['hello', 'world', 1, 2, 3, true, 'world', 3, 'hello'] as const,
        constant(false as const),
      ),
    ).toEqualTypeOf<[]>();
  });

  it('type predicate', () => {
    expectTypeOf(
      filter(
        ['hello', 'world', 1, 2, 3, true, 'world', 3, 'hello'] as const,
        isString,
      ),
    ).toEqualTypeOf<['hello', 'world', 'world', 'hello']>();
  });

  it('type predicate with union type', () => {
    const result = filter(
      ['hello', 'world', 1, 2, 3, true, 'world', 3, 'hello'] as const,
      // TODO [>2]: We don't need the return type here once the minimum TypeScript version is 5.5 or higher.
      ($): $ is 1 | 'world' => $ === 1 || $ === 'world',
    );

    expectTypeOf(result).toEqualTypeOf<['world', 1, 'world']>();
  });
});

describe('special tuple shapes', () => {
  it('optional elements', () => {
    const data = ['hello'] as [string, number?];

    expectTypeOf(filter(data, isStrictEqual('world' as const))).toEqualTypeOf<
      [] | ['world']
    >();
    expectTypeOf(filter(data, isStrictEqual(123 as const))).toEqualTypeOf<
      [] | [123]
    >();
  });

  it('non-empty array', () => {
    const data = ['hello'] as [string, ...Array<string>];

    expectTypeOf(filter(data, isStrictEqual('world' as const))).toEqualTypeOf<
      Array<'world'> | ['world', ...Array<'world'>]
    >();
    expectTypeOf(filter(data, isString)).toEqualTypeOf<
      [string, ...Array<string>]
    >();
    expectTypeOf(filter(data, constant(true))).toEqualTypeOf<Array<string>>();
  });

  it('rest element is filtered out', () => {
    const data = ['hello', 'world'] as [string, ...Array<number>, string];

    expectTypeOf(filter(data, isString)).toEqualTypeOf<[string, string]>();
  });

  it('rest element is kept', () => {
    const data = ['hello', 'world'] as [string, ...Array<number>, string];

    expectTypeOf(filter(data, isNumber)).toEqualTypeOf<Array<number>>();
  });

  it('non-empty array filtered with regular predicate', () => {
    const data = ['hello', 'world'] as [string, ...Array<number>, string];

    expectTypeOf(filter(data, constant(true))).toEqualTypeOf<
      Array<string | number>
    >();
  });

  it('non-empty array with union of types and type-predicate on those types', () => {
    expectTypeOf(
      filter(
        ['hello', true] as [string, ...Array<number>, boolean],
        isStrictEqual('hello' as 'hello' | 123 | true),
      ),
    ).toEqualTypeOf<
      | Array<123>
      | [...Array<123>, true]
      | ['hello', ...Array<123>]
      | ['hello', ...Array<123>, true]
    >();
  });
});

it('discriminated union filtering', () => {
  const data = [] as Array<
    { type: 'cat'; hates: string } | { type: 'dog'; numFriends: number }
  >;

  expectTypeOf(
    filter(
      data,
      // TODO [>2]: We don't need the return type here once the minimum TypeScript version is 5.5 or higher.
      ($): $ is { type: 'cat' } & (typeof data)[number] => $.type === 'cat',
    ),
  ).toEqualTypeOf<Array<{ type: 'cat'; hates: string }>>();
  expectTypeOf(
    filter(
      data,
      // TODO [>2]: We don't need the return type here once the minimum TypeScript version is 5.5 or higher.
      ($): $ is { type: 'dog' } & (typeof data)[number] => $.type === 'dog',
    ),
  ).toEqualTypeOf<Array<{ type: 'dog'; numFriends: number }>>();
});

describe('accepts readonly arrays, returns mutable ones', () => {
  // We trust FilteredArray to return a mutable array, but we need to make sure
  // that we also remove any readonly modifiers when handling trivial predicates
  // too

  it('predicate', () => {
    expectTypeOf(
      filter([] as ReadonlyArray<string>, constant(true)),
    ).toEqualTypeOf<Array<string>>();
  });

  it('trivial acceptor', () => {
    expectTypeOf(
      filter([] as ReadonlyArray<string>, constant(true as const)),
    ).toEqualTypeOf<Array<string>>();
  });

  it('trivial rejector', () => {
    expectTypeOf(
      filter([] as ReadonlyArray<string>, constant(false as const)),
    ).toEqualTypeOf<[]>();
  });

  it('type predicate', () => {
    expectTypeOf(
      filter([] as ReadonlyArray<string>, isStrictEqual('hello' as const)),
    ).toEqualTypeOf<Array<'hello'>>();
  });
});

it('null filtering', () => {
  expectTypeOf(
    filter([] as Array<string | undefined>, isNonNullish),
  ).toEqualTypeOf<Array<string>>();

  expectTypeOf(filter([] as Array<string | null>, isNonNullish)).toEqualTypeOf<
    Array<string>
  >();

  expectTypeOf(
    filter([] as Array<string | null | undefined>, isDefined),
  ).toEqualTypeOf<Array<string | null>>();

  expectTypeOf(
    filter([] as Array<string | null | undefined>, isNonNull),
  ).toEqualTypeOf<Array<string | undefined>>();

  expectTypeOf(
    filter([] as Array<string | null | undefined>, isNonNullish),
  ).toEqualTypeOf<Array<string>>();
});

describe('data last', () => {
  it('regular predicate', () => {
    const result = pipe(
      [1, 2, 3] as const,
      filter((x) => x % 2 === 1),
    );

    expectTypeOf(result).toEqualTypeOf<Array<1 | 2 | 3>>();
  });

  it('type-guard', () => {
    const result = pipe([1, 2, 3, false, 'text'] as const, filter(isNumber));

    expectTypeOf(result).toEqualTypeOf<[1, 2, 3]>();
  });
});

describe('union of array types', () => {
  it('arrays', () => {
    expectTypeOf(
      filter(
        [] as Array<string | undefined> | Array<number | undefined>,
        isDefined,
      ),
    ).toEqualTypeOf<Array<string> | Array<number>>();
  });

  it('disjoint conditions', () => {
    expectTypeOf(
      filter([] as Array<string> | Array<number>, isString),
    ).toEqualTypeOf<[] | Array<string>>();
  });

  it('fixed tuples', () => {
    expectTypeOf(
      filter(
        ['hello', 0] as ['hello', 0] | [1, 2, 'world', true, 3, 'hello', 4],
        isNumber,
      ),
    ).toEqualTypeOf<[0] | [1, 2, 3, 4]>();
  });
});
