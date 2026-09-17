import type { Cat, Kitten, Named } from '../test/interfaces';
import { describe, expectTypeOf, it, test } from 'vitest';
import { $typed } from '../test/$typed';
import {
  isCat,
  isNamed,
} from '../test/interfaces';
import { constant } from './constant';
import { filter } from './filter';
import { isDefined } from './is-defined';
import { isNonNull } from './is-non-null';
import { isNonNullish } from './is-non-nullish';
import { isNullish } from './is-nullish';
import { isNumber } from './is-number';
import { isStrictEqual } from './is-strict-equal';
import { isString } from './is-string';
import { pipe } from './pipe';

describe('primitives arrays', () => {
  it('predicate', () => {
    expectTypeOf(
      filter([] as Array<string>, constant($typed<boolean>())),
    ).toEqualTypeOf<Array<string>>();
  });

  it('trivial acceptor', () => {
    expectTypeOf(filter([] as Array<string>, constant(true))).toEqualTypeOf<
      Array<string>
    >();
  });

  it('trivial rejector', () => {
    expectTypeOf(filter([] as Array<string>, constant(false))).toEqualTypeOf<[]>();
  });

  it('type predicate', () => {
    expectTypeOf(
      filter([] as Array<string>, isStrictEqual('hello' as const)),
    ).toEqualTypeOf<Array<'hello'>>();
  });

  it('type predicate of the same type as the array', () => {
    expectTypeOf(filter([] as Array<string>, isString)).toEqualTypeOf<Array<string>>();
  });
});

describe('arrays with literal unions', () => {
  it('predicate', () => {
    expectTypeOf(
      filter([] as Array<'cat' | 'dog'>, constant($typed<boolean>())),
    ).toEqualTypeOf<Array<'cat' | 'dog'>>();
  });

  it('trivial acceptor', () => {
    expectTypeOf(filter([] as Array<'cat' | 'dog'>, constant(true))).toEqualTypeOf<
      Array<'cat' | 'dog'>
    >();
  });

  it('trivial rejector', () => {
    expectTypeOf(
      filter([] as Array<'cat' | 'dog'>, constant(false)),
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
        constant($typed<boolean>()),
      ),
    ).toEqualTypeOf<Array<true | 1 | 2 | 3 | 'hello' | 'world'>>();
  });

  it('trivial acceptor', () => {
    expectTypeOf(
      filter(
        ['hello', 'world', 1, 2, 3, true, 'world', 3, 'hello'] as const,
        constant(true),
      ),
    ).toEqualTypeOf<['hello', 'world', 1, 2, 3, true, 'world', 3, 'hello']>();
  });

  it('trivial rejector', () => {
    expectTypeOf(
      filter(
        ['hello', 'world', 1, 2, 3, true, 'world', 3, 'hello'] as const,
        constant(false),
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
      [] | [123?]
    >();
  });

  it('all-optional tuple with a trivial acceptor', () => {
    expectTypeOf(
      filter([] as readonly [string?, number?], constant(true)),
    ).toEqualTypeOf<[string?, number?]>();
  });

  it('non-empty array', () => {
    const data = ['hello'] as [string, ...Array<string>];

    expectTypeOf(filter(data, isStrictEqual('world' as const))).toEqualTypeOf<
      Array<'world'> | ['world', ...Array<'world'>]
    >();
    expectTypeOf(filter(data, isString)).toEqualTypeOf<[string, ...Array<string>]>();
    expectTypeOf(filter(data, constant($typed<boolean>()))).toEqualTypeOf<
      Array<string>
    >();
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

    expectTypeOf(filter(data, constant($typed<boolean>()))).toEqualTypeOf<
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
      Array<123> | [...Array<123>, true] | ['hello', ...Array<123>] | ['hello', ...Array<123>, true]
    >();
  });
});

test('discriminated union filtering', () => {
  const data = [] as Array<{ type: 'cat'; hates: string } | { type: 'dog'; numFriends: number }>;

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
      filter([] as ReadonlyArray<string>, constant($typed<boolean>())),
    ).toEqualTypeOf<Array<string>>();
  });

  it('trivial acceptor', () => {
    expectTypeOf(filter([] as ReadonlyArray<string>, constant(true))).toEqualTypeOf<
      Array<string>
    >();
  });

  it('trivial acceptor on a tuple with a rest item', () => {
    expectTypeOf(
      filter($typed<readonly [number, ...Array<string>, boolean]>(), constant(true)),
    ).toEqualTypeOf<[number, ...Array<string>, boolean]>();
  });

  it('trivial acceptor on a union of arrays', () => {
    expectTypeOf(
      filter($typed<ReadonlyArray<string> | readonly [number]>(), constant(true)),
    ).toEqualTypeOf<Array<string> | [number]>();
  });

  it('trivial rejector', () => {
    expectTypeOf(
      filter([] as ReadonlyArray<string>, constant(false)),
    ).toEqualTypeOf<[]>();
  });

  it('type predicate', () => {
    expectTypeOf(
      filter([] as ReadonlyArray<string>, isStrictEqual('hello' as const)),
    ).toEqualTypeOf<Array<'hello'>>();
  });
});

test('null filtering', () => {
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

  it('partially overlapping', () => {
    expectTypeOf(
      pipe([] as Array<string | null>, filter(isNullish)),
    ).toEqualTypeOf<Array<null>>();
  });
});

describe('union of array types', () => {
  it('arrays', () => {
    expectTypeOf(
      filter([] as Array<string | undefined> | Array<number | undefined>, isDefined),
    ).toEqualTypeOf<Array<string> | Array<number>>();
  });

  it('disjoint conditions', () => {
    expectTypeOf(filter([] as Array<string> | Array<number>, isString)).toEqualTypeOf<
      [] | Array<string>
    >();
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

describe('condition isn\'t a subtype of the item', () => {
  it('partially overlapping', () => {
    expectTypeOf(filter([] as Array<string | null>, isNullish)).toEqualTypeOf<
      Array<null>
    >();
  });

  it('disjoint', () => {
    expectTypeOf(filter([] as Array<string>, isNullish)).toEqualTypeOf<[]>();
  });

  it('object guard sharing no keys with the item', () => {
    expectTypeOf(filter([] as Array<Cat>, isNamed)).toEqualTypeOf<Array<Cat & Named>>();
  });

  it('object guard sharing no keys with a tuple item', () => {
    expectTypeOf(filter($typed<[Cat]>(), isNamed)).toEqualTypeOf<
      [] | [Cat & Named]
    >();
  });

  describe('supertype', () => {
    it('empty tuple', () => {
      expectTypeOf(filter($typed<[]>(), isCat)).toEqualTypeOf<[]>();
    });

    it('fixed tuple', () => {
      expectTypeOf(filter($typed<[Kitten, Kitten]>(), isCat)).toEqualTypeOf<
        [Kitten, Kitten]
      >();
    });

    it('readonly fixed tuple', () => {
      expectTypeOf(
        filter($typed<readonly [Kitten, Kitten]>(), isCat),
      ).toEqualTypeOf<[Kitten, Kitten]>();
    });

    it('optional tuple', () => {
      expectTypeOf(filter($typed<[Kitten?]>(), isCat)).toEqualTypeOf<
        [Kitten?]
      >();
    });

    it('mixed tuple', () => {
      expectTypeOf(filter($typed<[Kitten, Kitten?]>(), isCat)).toEqualTypeOf<
        [Kitten, Kitten?]
      >();
    });

    it('array', () => {
      expectTypeOf(filter([] as Array<Kitten>, isCat)).toEqualTypeOf<Array<Kitten>>();
    });

    it('fixed-prefix array', () => {
      expectTypeOf(
        filter($typed<[Kitten, ...Array<Kitten>]>(), isCat),
      ).toEqualTypeOf<[Kitten, ...Array<Kitten>]>();
    });

    it('optional-prefix array', () => {
      expectTypeOf(
        filter($typed<[Kitten?, ...Array<Kitten>]>(), isCat),
      ).toEqualTypeOf<[Kitten?, ...Array<Kitten>]>();
    });

    it('mixed-prefix array', () => {
      expectTypeOf(
        filter($typed<[Kitten, Kitten?, ...Array<Kitten>]>(), isCat),
      ).toEqualTypeOf<[Kitten, Kitten?, ...Array<Kitten>]>();
    });

    it('fixed-suffix array', () => {
      expectTypeOf(
        filter($typed<[...Array<Kitten>, Kitten]>(), isCat),
      ).toEqualTypeOf<[...Array<Kitten>, Kitten]>();
    });

    it('fixed-elements array', () => {
      expectTypeOf(
        filter($typed<[Kitten, ...Array<Kitten>, Kitten]>(), isCat),
      ).toEqualTypeOf<[Kitten, ...Array<Kitten>, Kitten]>();
    });

    it('union of arrays', () => {
      expectTypeOf(filter($typed<Array<Kitten> | Array<string>>(), isCat)).toEqualTypeOf<
        [] | Array<Kitten>
      >();
    });
  });
});

test('`unknown` data', () => {
  expectTypeOf(filter([] as Array<unknown>, isString)).toEqualTypeOf<Array<string>>();
});

describe('callback data param', () => {
  it('complete in data-first', () => {
    filter([1, 2, 3] as const, (_value, _index, data) => {
      expectTypeOf(data).toEqualTypeOf<readonly [1, 2, 3]>();

      return true;
    });
  });

  it('lazily reconstructed in data-last', () => {
    pipe(
      [1, 2, 3] as const,
      filter((_value, _index, data) => {
        expectTypeOf(data).toEqualTypeOf<readonly [1, 2?, 3?]>();

        return true;
      }),
    );
  });

  it('lazily reconstructed in data-last with a type predicate', () => {
    pipe(
      [1, 2, 3] as const,
      filter((value, _index, data): value is 2 => {
        expectTypeOf(data).toEqualTypeOf<readonly [1, 2?, 3?]>();

        return value === 2;
      }),
    );
  });
});
