import type { Cat, Legged, Named } from '../test/interfaces';
import { describe, expectTypeOf, it } from 'vitest';
import { $typed } from '../test/$typed';
import {
  isLegged,
  isNamed,
} from '../test/interfaces';
import { constant } from './constant';
import { find } from './find';
import { isArray } from './is-array';
import { isNot } from './is-not';
import { isPlainObject } from './is-plain-object';
import { isString } from './is-string';
import { isTruthy } from './is-truthy';
import { pipe } from './pipe';

it('can narrow types', () => {
  expectTypeOf(find([] as Array<number | string>, isString)).toEqualTypeOf<
    string | undefined
  >();
});

it('array where every item matches', () => {
  expectTypeOf(find([] as Array<string>, isString)).toEqualTypeOf<
    string | undefined
  >();
});

it('narrows when the predicate is wider than the item', () => {
  expectTypeOf(
    find([[1], 'a'] as Array<Array<number> | string>, isArray),
  ).toEqualTypeOf<Array<number> | undefined>();
});

it('accepts a union of array types', () => {
  expectTypeOf(find([] as Array<string> | Array<number>, isString)).toEqualTypeOf<
    string | undefined
  >();
});

it('predicate disjoint from the item', () => {
  expectTypeOf(find([] as Array<number>, isArray)).toEqualTypeOf<undefined>();
});

it('readonly tuple', () => {
  expectTypeOf(find([1, 'a', true] as const, isString)).toEqualTypeOf<'a'>();
});

it('readonly array', () => {
  expectTypeOf(
    find([] as ReadonlyArray<number | string>, isString),
  ).toEqualTypeOf<string | undefined>();
});

it('narrows with a guard incomparable to the item', () => {
  expectTypeOf(find([] as Array<Cat>, isLegged)).toEqualTypeOf<
    (Cat & Legged) | undefined
  >();
});

it('guard incomparable to a tuple item', () => {
  expectTypeOf(find($typed<[Cat]>(), isLegged)).toEqualTypeOf<
    (Cat & Legged) | undefined
  >();
});

it('object guard sharing no keys with the item', () => {
  expectTypeOf(find([] as Array<Cat>, isNamed)).toEqualTypeOf<
    (Cat & Named) | undefined
  >();
});

it('isPlainObject guard on interface items', () => {
  expectTypeOf(find([] as Array<Cat>, isPlainObject)).toEqualTypeOf<
    (Cat & Record<PropertyKey, unknown>) | undefined
  >();
});

it('`unknown` data', () => {
  expectTypeOf(find([] as Array<unknown>, isString)).toEqualTypeOf<
    string | undefined
  >();
});

it('narrows with a generic guard', () => {
  expectTypeOf(find(['a', 0] as Array<string | 0>, isTruthy)).toEqualTypeOf<
    string | undefined
  >();
});

it('narrows with a negated guard', () => {
  expectTypeOf(
    find([1, 'a'] as Array<number | string>, isNot(isString)),
  ).toEqualTypeOf<number | undefined>();
});

describe('guaranteed match', () => {
  it('tuple', () => {
    expectTypeOf(
      find([1, 'a', true] as [number, string, boolean], isString),
    ).toEqualTypeOf<string>();
  });

  it('after a possible match', () => {
    expectTypeOf(
      find([1, 'a'] as [number | string, string], isString),
    ).toEqualTypeOf<string>();
  });

  it('non-empty array', () => {
    expectTypeOf(
      find(['a'] as [string, ...Array<number>], isString),
    ).toEqualTypeOf<string>();
  });

  it('suffix', () => {
    expectTypeOf(
      find(['a'] as [...Array<number>, string], isString),
    ).toEqualTypeOf<string>();
  });

  it('stops at the first guaranteed match', () => {
    expectTypeOf(
      find(['a', 'b', 'c'] as [1 | 'a', 'b', 'c'], isString),
    ).toEqualTypeOf<'a' | 'b'>();
  });

  it('before an optional item', () => {
    expectTypeOf(
      find(['a'] as [string, number?], isString),
    ).toEqualTypeOf<string>();
  });

  it('before a rest item', () => {
    expectTypeOf(
      find(['a', true] as [string, ...Array<number>, boolean], isString),
    ).toEqualTypeOf<string>();
  });

  it('predicate wider than the item', () => {
    expectTypeOf(find([[1], 'a'] as [Array<number>, string], isArray)).toEqualTypeOf<
      Array<number>
    >();
  });

  it('only in some members of a union of arrays', () => {
    expectTypeOf(find([] as [string] | Array<number>, isString)).toEqualTypeOf<
      string | undefined
    >();
  });
});

describe('possible match', () => {
  it('union item', () => {
    expectTypeOf(
      find([1, true] as [number | string, boolean], isString),
    ).toEqualTypeOf<string | undefined>();
  });

  it('optional item', () => {
    expectTypeOf(find([] as [string?], isString)).toEqualTypeOf<
      string | undefined
    >();
  });

  it('rest item', () => {
    expectTypeOf(find([1] as [number, ...Array<string>], isString)).toEqualTypeOf<
      string | undefined
    >();
  });

  it('union of tuples', () => {
    expectTypeOf(find(['a'] as [string] | [number], isString)).toEqualTypeOf<
      string | undefined
    >();
  });

  it('optional item before a rest item', () => {
    expectTypeOf(find([] as [number?, ...Array<string>], isString)).toEqualTypeOf<
      string | undefined
    >();
  });

  it('suffix item', () => {
    expectTypeOf(
      find(['a'] as [...Array<number>, number | string], isString),
    ).toEqualTypeOf<string | undefined>();
  });

  it('rest and suffix items', () => {
    expectTypeOf(
      find([true] as [...Array<number | string>, boolean | string], isString),
    ).toEqualTypeOf<string | undefined>();
  });
});

describe('no match', () => {
  it('empty tuple', () => {
    expectTypeOf(find([] as [], isString)).toEqualTypeOf<undefined>();
  });

  it('tuple', () => {
    expectTypeOf(
      find([1, true] as [number, boolean], isString),
    ).toEqualTypeOf<undefined>();
  });

  it('optional item', () => {
    expectTypeOf(find([] as [number?], isString)).toEqualTypeOf<undefined>();
  });
});

describe('non-guard predicate', () => {
  it('array', () => {
    expectTypeOf(
      find([] as Array<number | string>, constant($typed<boolean>())),
    ).toEqualTypeOf<number | string | undefined>();
  });

  it('tuple', () => {
    expectTypeOf(
      find([1, 'a'] as [number, string], constant($typed<boolean>())),
    ).toEqualTypeOf<number | string | undefined>();
  });

  it('trivial acceptor on an array', () => {
    expectTypeOf(find([] as Array<number>, constant(true))).toEqualTypeOf<
      number | undefined
    >();
  });

  it('trivial acceptor on a tuple', () => {
    expectTypeOf(
      find([1, 'a'] as [number, string], constant(true)),
    ).toEqualTypeOf<number>();
  });

  it('trivial acceptor on a non-empty array', () => {
    expectTypeOf(
      find(['a'] as [string, ...Array<number>], constant(true)),
    ).toEqualTypeOf<string>();
  });

  it('trivial acceptor on a union of arrays', () => {
    expectTypeOf(find([] as [string] | Array<number>, constant(true))).toEqualTypeOf<
      string | number | undefined
    >();
  });

  it('trivial rejector', () => {
    expectTypeOf(
      find([1, 'a'] as [number, string], constant(false)),
    ).toEqualTypeOf<undefined>();
  });
});

it('predicate is typed correctly', () => {
  find([] as Array<number | string>, (value, index, data) => {
    expectTypeOf(value).toEqualTypeOf<number | string>();
    expectTypeOf(index).toEqualTypeOf<number>();
    expectTypeOf(data).toEqualTypeOf<Array<number | string>>();

    return true;
  });
});

it('predicate is typed correctly for tuples', () => {
  find([1, 'a'] as [number, string], (value, index, data) => {
    expectTypeOf(value).toEqualTypeOf<number | string>();
    expectTypeOf(index).toEqualTypeOf<number>();
    expectTypeOf(data).toEqualTypeOf<[number, string]>();

    return true;
  });
});

it('predicate with a mismatched param is an error', () => {
  // @ts-expect-error [ts2769] -- The predicate must accept the item type.
  find([] as Array<number>, (x: string) => x.length > 0);
});

describe('data-last', () => {
  it('narrowing predicate', () => {
    expectTypeOf(pipe([1, 'a'], find(isString))).toEqualTypeOf<
      string | undefined
    >();
  });

  it('predicate is wider than the item', () => {
    expectTypeOf(
      pipe([[1], 'a'] as Array<Array<number> | string>, find(isArray)),
    ).toEqualTypeOf<Array<number> | undefined>();
  });

  it('non-guard predicate', () => {
    expectTypeOf(
      pipe([1, 'a'] as [number, string], find(constant($typed<boolean>()))),
    ).toEqualTypeOf<number | string | undefined>();
  });

  it('predicate disjoint from the item', () => {
    expectTypeOf(
      pipe([] as Array<number>, find(isArray)),
    ).toEqualTypeOf<undefined>();
  });

  it('generic guard', () => {
    expectTypeOf(
      pipe(['a', 0] as Array<string | 0>, find(isTruthy)),
    ).toEqualTypeOf<string | undefined>();
  });

  it('negated guard', () => {
    expectTypeOf(
      pipe([1, 'a'] as Array<number | string>, find(isNot(isString))),
    ).toEqualTypeOf<number | undefined>();
  });

  it('readonly tuple', () => {
    expectTypeOf(
      pipe([1, 'a', true] as const, find(isString)),
    ).toEqualTypeOf<'a'>();
  });

  it('guaranteed match', () => {
    expectTypeOf(
      pipe([1, 'a', true] as [number, string, boolean], find(isString)),
    ).toEqualTypeOf<string>();
  });

  it('possible match', () => {
    expectTypeOf(
      pipe([1, true] as [number | string, boolean], find(isString)),
    ).toEqualTypeOf<string | undefined>();
  });

  it('no match', () => {
    expectTypeOf(
      pipe([1, true] as [number, boolean], find(isString)),
    ).toEqualTypeOf<undefined>();
  });

  it('trivial acceptor on a tuple', () => {
    expectTypeOf(
      pipe([1, 'a'] as [number, string], find(constant(true))),
    ).toEqualTypeOf<number>();
  });

  it('trivial rejector', () => {
    expectTypeOf(
      pipe([1, 'a'] as [number, string], find(constant(false))),
    ).toEqualTypeOf<undefined>();
  });

  it('guard incomparable to the item', () => {
    expectTypeOf(pipe([] as Array<Cat>, find(isLegged))).toEqualTypeOf<
      (Cat & Legged) | undefined
    >();
  });

  it('object guard sharing no keys with the item', () => {
    expectTypeOf(pipe([] as Array<Cat>, find(isNamed))).toEqualTypeOf<
      (Cat & Named) | undefined
    >();
  });

  it('predicate is typed correctly', () => {
    pipe(
      [] as Array<number | string>,
      find((value, index, data) => {
        expectTypeOf(value).toEqualTypeOf<number | string>();
        expectTypeOf(index).toEqualTypeOf<number>();
        expectTypeOf(data).toEqualTypeOf<
          readonly [number | string, ...Array<number | string>]
        >();

        return true;
      }),
    );
  });
});

describe('callback data param', () => {
  it('lazily reconstructed in data-last', () => {
    pipe(
      [1, 2, 3] as const,
      find((_value, _index, data) => {
        expectTypeOf(data).toEqualTypeOf<readonly [1, 2?, 3?]>();

        return true;
      }),
    );
  });

  it('lazily reconstructed in data-last with a type predicate', () => {
    pipe(
      [1, 2, 3] as const,
      find((value, _index, data): value is 2 => {
        expectTypeOf(data).toEqualTypeOf<readonly [1, 2?, 3?]>();

        return value === 2;
      }),
    );
  });
});
