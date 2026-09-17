import type { Cat, Kitten, Legged, Named } from '../test/interfaces';
import { describe, expectTypeOf, it, test } from 'vitest';
import { $typed } from '../test/$typed';
import {
  isCat,
  isLegged,
  isNamed,
} from '../test/interfaces';
import { constant } from './constant';
import { isDefined } from './is-defined';
import { isNot } from './is-not';
import { isNullish } from './is-nullish';
import { isNumber } from './is-number';
import { isString } from './is-string';
import { partition } from './partition';
import { pipe } from './pipe';

test('partition with type guard', () => {
  expectTypeOf(partition([1, 'a', 2, 'b'], isNumber)).toEqualTypeOf<
    [[number, number], [string, string]]
  >();
});

test('narrows both sides when the predicate is wider than the item', () => {
  expectTypeOf(
    partition(['a', null] as Array<string | null>, isNullish),
  ).toEqualTypeOf<[Array<null>, Array<string>]>();
});

test('narrows tuples down to the matching items', () => {
  expectTypeOf(
    partition([1, 'a', true] as [1, 'a', true], isString),
  ).toEqualTypeOf<[['a'], [1, true]]>();
});

test('readonly tuple', () => {
  expectTypeOf(partition([1, 'a', true] as const, isString)).toEqualTypeOf<
    [['a'], [1, true]]
  >();
});

test('tuple with a rest item', () => {
  expectTypeOf(
    partition($typed<[string, ...Array<number>, boolean]>(), isString),
  ).toEqualTypeOf<[[string], [...Array<number>, boolean]]>();
});

test('tuple with an optional item', () => {
  expectTypeOf(partition($typed<[string, number?]>(), isString)).toEqualTypeOf<
    [[string], [number?]]
  >();
});

test('union of arrays', () => {
  expectTypeOf(partition([] as Array<string> | Array<number>, isString)).toEqualTypeOf<
    [[] | Array<string>, [] | Array<number>]
  >();
});

test('narrows with a guard incomparable to the item', () => {
  expectTypeOf(partition([] as Array<Cat>, isLegged)).toEqualTypeOf<
    [Array<Cat & Legged>, Array<Cat>]
  >();
});

test('object guard sharing no keys with the item', () => {
  expectTypeOf(partition([] as Array<Cat>, isNamed)).toEqualTypeOf<
    [Array<Cat & Named>, Array<Cat>]
  >();
});

test('object guard sharing no keys with a tuple item', () => {
  expectTypeOf(partition($typed<[Cat]>(), isNamed)).toEqualTypeOf<
    [[] | [Cat & Named], [] | [Cat]]
  >();
});

test('guard for a supertype of the item can\'t reject', () => {
  expectTypeOf(partition([] as Array<Kitten>, isCat)).toEqualTypeOf<
    [Array<Kitten>, []]
  >();
});

test('narrows with a generic guard', () => {
  expectTypeOf(
    partition([1, undefined] as Array<number | undefined>, isDefined),
  ).toEqualTypeOf<[Array<number>, Array<undefined>]>();
});

test('narrows with a negated guard', () => {
  expectTypeOf(
    partition([1, 'a'] as Array<number | string>, isNot(isString)),
  ).toEqualTypeOf<[Array<number>, Array<string>]>();
});

test('predicate is typed correctly', () => {
  partition([] as Array<number | string>, (value, index, data) => {
    expectTypeOf(value).toEqualTypeOf<number | string>();
    expectTypeOf(index).toEqualTypeOf<number>();
    expectTypeOf(data).toEqualTypeOf<Array<number | string>>();

    return true;
  });
});

test('predicate disjoint from the item', () => {
  expectTypeOf(partition([] as Array<string>, isNullish)).toEqualTypeOf<
    [[], Array<string>]
  >();
});

test('`unknown` data', () => {
  expectTypeOf(partition([] as Array<unknown>, isString)).toEqualTypeOf<
    [Array<string>, Array<unknown>]
  >();
});

test('predicate with a mismatched param is an error', () => {
  // @ts-expect-error [ts2769] -- The predicate must accept the item type.
  partition([] as Array<number>, (x: string) => x.length > 0);
});

test('non-guard predicate keeps both sides unnarrowed', () => {
  expectTypeOf(partition([1, 'a'], constant($typed<boolean>()))).toEqualTypeOf<
    [Array<number | string>, Array<number | string>]
  >();
});

test('always-true predicate', () => {
  expectTypeOf(partition([1, 'a'], constant(true))).toEqualTypeOf<
    [[number, string], []]
  >();
});

test('always-false predicate', () => {
  expectTypeOf(partition([1, 'a'], constant(false))).toEqualTypeOf<
    [[], [number, string]]
  >();
});

test('all-optional tuple with a trivial rejector', () => {
  expectTypeOf(
    partition([] as readonly [string?, number?], constant(false)),
  ).toEqualTypeOf<[[], [string?, number?]]>();
});

test('readonly array with a non-guard predicate', () => {
  expectTypeOf(
    partition([] as ReadonlyArray<number>, constant($typed<boolean>())),
  ).toEqualTypeOf<[Array<number>, Array<number>]>();
});

describe('data-last', () => {
  it('non-guard predicate', () => {
    expectTypeOf(
      pipe([1, 'a'], partition(constant($typed<boolean>()))),
    ).toEqualTypeOf<[Array<string | number>, Array<string | number>]>();
  });

  it('always-true predicate', () => {
    expectTypeOf(pipe([1, 'a'], partition(constant(true)))).toEqualTypeOf<
      [Array<string | number>, []]
    >();
  });

  it('always-false predicate', () => {
    expectTypeOf(pipe([1, 'a'], partition(constant(false)))).toEqualTypeOf<
      [[], Array<string | number>]
    >();
  });

  it('partition with type guard', () => {
    expectTypeOf(pipe([1, 'a', 2, 'b'], partition(isNumber))).toEqualTypeOf<
      [Array<number>, Array<string>]
    >();
  });

  it('narrows both sides when the predicate is wider than the item', () => {
    expectTypeOf(
      pipe(['a', null] as Array<string | null>, partition(isNullish)),
    ).toEqualTypeOf<[Array<null>, Array<string>]>();
  });

  it('predicate disjoint from the item', () => {
    expectTypeOf(pipe([] as Array<string>, partition(isNullish))).toEqualTypeOf<
      [[], Array<string>]
    >();
  });

  it('guard for a supertype of the item can\'t reject', () => {
    expectTypeOf(pipe([] as Array<Kitten>, partition(isCat))).toEqualTypeOf<
      [Array<Kitten>, []]
    >();
  });

  it('generic guard', () => {
    expectTypeOf(
      pipe([1, undefined] as Array<number | undefined>, partition(isDefined)),
    ).toEqualTypeOf<[Array<number>, Array<undefined>]>();
  });

  it('negated guard', () => {
    expectTypeOf(
      pipe([1, 'a'] as Array<number | string>, partition(isNot(isString))),
    ).toEqualTypeOf<[Array<number>, Array<string>]>();
  });

  it('narrows tuples down to the matching items', () => {
    expectTypeOf(
      pipe([1, 'a', true] as const, partition(isString)),
    ).toEqualTypeOf<[['a'], [1, true]]>();
  });

  it('narrows with a guard incomparable to the item', () => {
    expectTypeOf(pipe([] as Array<Cat>, partition(isLegged))).toEqualTypeOf<
      [Array<Cat & Legged>, Array<Cat>]
    >();
  });

  it('object guard sharing no keys with the item', () => {
    expectTypeOf(pipe([] as Array<Cat>, partition(isNamed))).toEqualTypeOf<
      [Array<Cat & Named>, Array<Cat>]
    >();
  });

  it('predicate is typed correctly', () => {
    pipe(
      [] as Array<number | string>,
      partition((value, index, data) => {
        expectTypeOf(value).toEqualTypeOf<number | string>();
        expectTypeOf(index).toEqualTypeOf<number>();
        expectTypeOf(data).toEqualTypeOf<Array<number | string>>();

        return true;
      }),
    );
  });
});
