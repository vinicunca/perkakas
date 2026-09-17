import type { Cat, Legged, Named } from '../test/interfaces';
import { describe, expectTypeOf, it, test } from 'vitest';
import { $typed } from '../test/$typed';
import {
  isLegged,
  isNamed,
} from '../test/interfaces';
import { constant } from './constant';
import { findLast } from './find-last';
import { isArray } from './is-array';
import { isNot } from './is-not';
import { isPlainObject } from './is-plain-object';
import { isString } from './is-string';
import { isTruthy } from './is-truthy';
import { pipe } from './pipe';

test('can narrow types', () => {
  expectTypeOf(findLast([] as Array<number | string>, isString)).toEqualTypeOf<
    string | undefined
  >();
});

test('array where every item matches', () => {
  expectTypeOf(findLast([] as Array<string>, isString)).toEqualTypeOf<
    string | undefined
  >();
});

test('narrows when the predicate is wider than the item', () => {
  expectTypeOf(
    findLast([[1], 'a'] as Array<Array<number> | string>, isArray),
  ).toEqualTypeOf<Array<number> | undefined>();
});

test('accepts a union of array types', () => {
  expectTypeOf(findLast([] as Array<string> | Array<number>, isString)).toEqualTypeOf<
    string | undefined
  >();
});

test('predicate disjoint from the item', () => {
  expectTypeOf(findLast([] as Array<number>, isArray)).toEqualTypeOf<undefined>();
});

test('readonly tuple', () => {
  expectTypeOf(
    findLast([1, 'a', true] as const, isString),
  ).toEqualTypeOf<'a'>();
});

test('readonly array', () => {
  expectTypeOf(
    findLast([] as ReadonlyArray<number | string>, isString),
  ).toEqualTypeOf<string | undefined>();
});

test('narrows with a guard incomparable to the item', () => {
  expectTypeOf(findLast([] as Array<Cat>, isLegged)).toEqualTypeOf<
    (Cat & Legged) | undefined
  >();
});

test('guard incomparable to a tuple item', () => {
  expectTypeOf(findLast($typed<[Cat]>(), isLegged)).toEqualTypeOf<
    (Cat & Legged) | undefined
  >();
});

test('object guard sharing no keys with the item', () => {
  expectTypeOf(findLast([] as Array<Cat>, isNamed)).toEqualTypeOf<
    (Cat & Named) | undefined
  >();
});

test('isPlainObject guard on interface items', () => {
  expectTypeOf(findLast([] as Array<Cat>, isPlainObject)).toEqualTypeOf<
    (Cat & Record<PropertyKey, unknown>) | undefined
  >();
});

test('`unknown` data', () => {
  expectTypeOf(findLast([] as Array<unknown>, isString)).toEqualTypeOf<
    string | undefined
  >();
});

test('narrows with a generic guard', () => {
  expectTypeOf(findLast(['a', 0] as Array<string | 0>, isTruthy)).toEqualTypeOf<
    string | undefined
  >();
});

test('narrows with a negated guard', () => {
  expectTypeOf(
    findLast([1, 'a'] as Array<number | string>, isNot(isString)),
  ).toEqualTypeOf<number | undefined>();
});

describe('guaranteed match', () => {
  it('tuple', () => {
    expectTypeOf(
      findLast([1, 'a', true] as [number, string, boolean], isString),
    ).toEqualTypeOf<string>();
  });

  it('before a possible match', () => {
    expectTypeOf(
      findLast(['a', 1] as [string, number | string], isString),
    ).toEqualTypeOf<string>();
  });

  it('non-empty array', () => {
    expectTypeOf(
      findLast(['a'] as [string, ...Array<number>], isString),
    ).toEqualTypeOf<string>();
  });

  it('suffix', () => {
    expectTypeOf(
      findLast(['a'] as [...Array<number>, string], isString),
    ).toEqualTypeOf<string>();
  });

  it('stops at the last guaranteed match', () => {
    expectTypeOf(
      findLast(['a', 'b', 'c'] as ['a', 'b', 1 | 'c'], isString),
    ).toEqualTypeOf<'b' | 'c'>();
  });

  it('before an optional item', () => {
    expectTypeOf(
      findLast(['a'] as [string, number?], isString),
    ).toEqualTypeOf<string>();
  });

  it('after a rest item', () => {
    expectTypeOf(
      findLast([true, 'a'] as [boolean, ...Array<number>, string], isString),
    ).toEqualTypeOf<string>();
  });

  it('predicate wider than the item', () => {
    expectTypeOf(
      findLast(['a', [1]] as [string, Array<number>], isArray),
    ).toEqualTypeOf<Array<number>>();
  });

  it('only in some members of a union of arrays', () => {
    expectTypeOf(findLast([] as [string] | Array<number>, isString)).toEqualTypeOf<
      string | undefined
    >();
  });
});

describe('possible match', () => {
  it('union item', () => {
    expectTypeOf(
      findLast([true, 1] as [boolean, number | string], isString),
    ).toEqualTypeOf<string | undefined>();
  });

  it('optional item', () => {
    expectTypeOf(findLast([] as [string?], isString)).toEqualTypeOf<
      string | undefined
    >();
  });

  it('rest item', () => {
    expectTypeOf(
      findLast([1] as [number, ...Array<string>], isString),
    ).toEqualTypeOf<string | undefined>();
  });

  it('union of tuples', () => {
    expectTypeOf(
      findLast(['a'] as [string] | [number], isString),
    ).toEqualTypeOf<string | undefined>();
  });

  it('optional item before a rest item', () => {
    expectTypeOf(
      findLast([] as [number?, ...Array<string>], isString),
    ).toEqualTypeOf<string | undefined>();
  });

  it('suffix item', () => {
    expectTypeOf(
      findLast(['a'] as [...Array<number>, number | string], isString),
    ).toEqualTypeOf<string | undefined>();
  });

  it('prefix and rest items', () => {
    expectTypeOf(
      findLast([true] as [boolean | string, ...Array<number | string>], isString),
    ).toEqualTypeOf<string | undefined>();
  });
});

describe('no match', () => {
  it('empty tuple', () => {
    expectTypeOf(findLast([] as [], isString)).toEqualTypeOf<undefined>();
  });

  it('tuple', () => {
    expectTypeOf(
      findLast([1, true] as [number, boolean], isString),
    ).toEqualTypeOf<undefined>();
  });

  it('optional item', () => {
    expectTypeOf(
      findLast([] as [number?], isString),
    ).toEqualTypeOf<undefined>();
  });
});

describe('non-guard predicate', () => {
  it('array', () => {
    expectTypeOf(
      findLast([] as Array<number | string>, constant($typed<boolean>())),
    ).toEqualTypeOf<number | string | undefined>();
  });

  it('tuple', () => {
    expectTypeOf(
      findLast([1, 'a'] as [number, string], constant($typed<boolean>())),
    ).toEqualTypeOf<number | string | undefined>();
  });

  it('trivial acceptor on an array', () => {
    expectTypeOf(findLast([] as Array<number>, constant(true))).toEqualTypeOf<
      number | undefined
    >();
  });

  it('trivial acceptor on a tuple', () => {
    expectTypeOf(
      findLast([1, 'a'] as [number, string], constant(true)),
    ).toEqualTypeOf<string>();
  });

  it('trivial acceptor on an array with a suffix', () => {
    expectTypeOf(
      findLast(['a'] as [...Array<number>, string], constant(true)),
    ).toEqualTypeOf<string>();
  });

  it('trivial rejector', () => {
    expectTypeOf(
      findLast([1, 'a'] as [number, string], constant(false)),
    ).toEqualTypeOf<undefined>();
  });
});

test('predicate is typed correctly', () => {
  findLast([] as Array<number | string>, (value, index, data) => {
    expectTypeOf(value).toEqualTypeOf<number | string>();
    expectTypeOf(index).toEqualTypeOf<number>();
    expectTypeOf(data).toEqualTypeOf<Array<number | string>>();

    return true;
  });
});

test('predicate is typed correctly for tuples', () => {
  findLast([1, 'a'] as [number, string], (value, index, data) => {
    expectTypeOf(value).toEqualTypeOf<number | string>();
    expectTypeOf(index).toEqualTypeOf<number>();
    expectTypeOf(data).toEqualTypeOf<[number, string]>();

    return true;
  });
});

test('predicate with a mismatched param is an error', () => {
  // @ts-expect-error [ts2769] -- The predicate must accept the item type.
  findLast([] as Array<number>, (x: string) => x.length > 0);
});

describe('data-last', () => {
  it('narrowing predicate', () => {
    expectTypeOf(pipe([1, 'a'], findLast(isString))).toEqualTypeOf<
      string | undefined
    >();
  });

  it('predicate is wider than the item', () => {
    expectTypeOf(
      pipe([[1], 'a'] as Array<Array<number> | string>, findLast(isArray)),
    ).toEqualTypeOf<Array<number> | undefined>();
  });

  it('non-guard predicate', () => {
    expectTypeOf(
      pipe([1, 'a'] as [number, string], findLast(constant($typed<boolean>()))),
    ).toEqualTypeOf<number | string | undefined>();
  });

  it('predicate disjoint from the item', () => {
    expectTypeOf(
      pipe([] as Array<number>, findLast(isArray)),
    ).toEqualTypeOf<undefined>();
  });

  it('generic guard', () => {
    expectTypeOf(
      pipe(['a', 0] as Array<string | 0>, findLast(isTruthy)),
    ).toEqualTypeOf<string | undefined>();
  });

  it('negated guard', () => {
    expectTypeOf(
      pipe([1, 'a'] as Array<number | string>, findLast(isNot(isString))),
    ).toEqualTypeOf<number | undefined>();
  });

  it('readonly tuple', () => {
    expectTypeOf(
      pipe([1, 'a', true] as const, findLast(isString)),
    ).toEqualTypeOf<'a'>();
  });

  it('guaranteed match', () => {
    expectTypeOf(
      pipe([1, 'a', true] as [number, string, boolean], findLast(isString)),
    ).toEqualTypeOf<string>();
  });

  it('possible match', () => {
    expectTypeOf(
      pipe([true, 1] as [boolean, number | string], findLast(isString)),
    ).toEqualTypeOf<string | undefined>();
  });

  it('no match', () => {
    expectTypeOf(
      pipe([1, true] as [number, boolean], findLast(isString)),
    ).toEqualTypeOf<undefined>();
  });

  it('trivial acceptor on a tuple', () => {
    expectTypeOf(
      pipe([1, 'a'] as [number, string], findLast(constant(true))),
    ).toEqualTypeOf<string>();
  });

  it('trivial rejector', () => {
    expectTypeOf(
      pipe([1, 'a'] as [number, string], findLast(constant(false))),
    ).toEqualTypeOf<undefined>();
  });

  it('guard incomparable to the item', () => {
    expectTypeOf(pipe([] as Array<Cat>, findLast(isLegged))).toEqualTypeOf<
      (Cat & Legged) | undefined
    >();
  });

  it('object guard sharing no keys with the item', () => {
    expectTypeOf(pipe([] as Array<Cat>, findLast(isNamed))).toEqualTypeOf<
      (Cat & Named) | undefined
    >();
  });

  it('predicate is typed correctly', () => {
    pipe(
      [] as Array<number | string>,
      findLast((value, index, data) => {
        expectTypeOf(value).toEqualTypeOf<number | string>();
        expectTypeOf(index).toEqualTypeOf<number>();
        expectTypeOf(data).toEqualTypeOf<Array<number | string>>();

        return true;
      }),
    );
  });
});
