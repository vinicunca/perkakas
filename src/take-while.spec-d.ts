import type { Cat, Legged, Named } from '../test/interfaces';
import { describe, expectTypeOf, it } from 'vitest';
import { $typed } from '../test/$typed';
import {

  isLegged,
  isNamed,

} from '../test/interfaces';
import { constant } from './constant';
import { isNot } from './is-not';
import { isNullish } from './is-nullish';
import { isNumber } from './is-number';
import { isString } from './is-string';
import { isTruthy } from './is-truthy';
import { pipe } from './pipe';
import { takeWhile } from './take-while';

describe('data-first', () => {
  it('empty array', () => {
    expectTypeOf(
      takeWhile([] as [], constant($typed<boolean>())),
    ).toEqualTypeOf<Array<never>>();
  });

  it('regular array', () => {
    expectTypeOf(
      takeWhile([] as Array<number>, constant($typed<boolean>())),
    ).toEqualTypeOf<Array<number>>();
  });

  it('regular array with union type', () => {
    expectTypeOf(
      takeWhile([] as Array<number | string>, constant($typed<boolean>())),
    ).toEqualTypeOf<Array<number | string>>();
  });

  it('prefix array', () => {
    expectTypeOf(
      takeWhile([1] as [number, ...Array<boolean>], constant($typed<boolean>())),
    ).toEqualTypeOf<Array<boolean | number>>();
  });

  it('suffix array', () => {
    expectTypeOf(
      takeWhile([1] as [...Array<boolean>, number], constant($typed<boolean>())),
    ).toEqualTypeOf<Array<boolean | number>>();
  });

  it('array with suffix and prefix', () => {
    expectTypeOf(
      takeWhile(
        [1, 'a'] as [number, ...Array<boolean>, string],
        constant($typed<boolean>()),
      ),
    ).toEqualTypeOf<Array<boolean | number | string>>();
  });

  it('tuple', () => {
    expectTypeOf(
      takeWhile([1, 'a', true] as const, constant($typed<boolean>())),
    ).toEqualTypeOf<Array<'a' | 1 | true>>();
  });

  it('union of arrays', () => {
    expectTypeOf(
      takeWhile([] as Array<boolean> | Array<string>, constant($typed<boolean>())),
    ).toEqualTypeOf<Array<boolean | string>>();
  });

  it('trivial acceptor', () => {
    expectTypeOf(
      takeWhile([1, 'a'] as readonly [number, string], constant(true)),
    ).toEqualTypeOf<[number, string]>();
  });

  it('trivial rejector', () => {
    expectTypeOf(takeWhile([] as Array<number>, constant(false))).toEqualTypeOf<
      []
    >();
  });

  it('assert type using predicate', () => {
    expectTypeOf(takeWhile([1, 'a'], isNumber)).toEqualTypeOf<Array<number>>();
  });

  it('guard on a tuple', () => {
    expectTypeOf(takeWhile([1, 'a', true] as const, isNumber)).toEqualTypeOf<
      Array<1>
    >();
  });

  it('guard on a union of arrays', () => {
    expectTypeOf(takeWhile([] as Array<string> | Array<number>, isString)).toEqualTypeOf<
      [] | Array<string>
    >();
  });

  it('guard on a union of tuples', () => {
    expectTypeOf(takeWhile([1] as [1] | ['a'], isNumber)).toEqualTypeOf<
      [] | [1]
    >();
  });

  it('guard on an empty tuple', () => {
    expectTypeOf(takeWhile([] as [], isString)).toEqualTypeOf<[]>();
  });

  it('guard matching every item of a tuple', () => {
    expectTypeOf(takeWhile([1, 2] as const, isNumber)).toEqualTypeOf<[1, 2]>();
  });

  it('guard matching every item of an array with suffix and prefix', () => {
    expectTypeOf(
      takeWhile([1, 2] as readonly [1, ...Array<number>, 2], isNumber),
    ).toEqualTypeOf<[1, ...Array<number>, 2]>();
  });

  it('predicate is typed correctly', () => {
    takeWhile([] as Array<number | string>, (item, index, array) => {
      expectTypeOf(item).toEqualTypeOf<number | string>();
      expectTypeOf(index).toEqualTypeOf<number>();
      expectTypeOf(array).toEqualTypeOf<Array<number | string>>();

      return true;
    });
  });

  it('predicate wider than the item', () => {
    expectTypeOf(takeWhile([] as Array<string | null>, isNullish)).toEqualTypeOf<
      Array<null>
    >();
  });

  it('predicate disjoint from the item', () => {
    expectTypeOf(takeWhile([] as Array<string>, isNullish)).toEqualTypeOf<[]>();
  });

  it('generic guard', () => {
    expectTypeOf(takeWhile(['a', 0] as Array<string | 0>, isTruthy)).toEqualTypeOf<
      Array<string>
    >();
  });

  it('negated guard', () => {
    expectTypeOf(
      takeWhile([1, 'a'] as Array<number | string>, isNot(isString)),
    ).toEqualTypeOf<Array<number>>();
  });

  it('guard incomparable to the item', () => {
    expectTypeOf(takeWhile([] as Array<Cat>, isLegged)).toEqualTypeOf<
      Array<Cat & Legged>
    >();
  });

  it('object guard sharing no keys with the item', () => {
    expectTypeOf(takeWhile([] as Array<Cat>, isNamed)).toEqualTypeOf<
      Array<Cat & Named>
    >();
  });

  it('`unknown` data', () => {
    expectTypeOf(takeWhile([] as Array<unknown>, isString)).toEqualTypeOf<
      Array<string>
    >();
  });

  it('predicate with a mismatched param is an error', () => {
    // @ts-expect-error [ts2769] -- The predicate must accept the item type.
    takeWhile([] as Array<number>, (x: string) => x.length > 0);
  });
});

describe('data-last', () => {
  it('empty array', () => {
    expectTypeOf(
      pipe([] as [], takeWhile(constant($typed<boolean>()))),
    ).toEqualTypeOf<Array<never>>();
  });

  it('regular array', () => {
    expectTypeOf(
      pipe([] as Array<number>, takeWhile(constant($typed<boolean>()))),
    ).toEqualTypeOf<Array<number>>();
  });

  it('regular array with union type', () => {
    expectTypeOf(
      pipe([] as Array<number | string>, takeWhile(constant($typed<boolean>()))),
    ).toEqualTypeOf<Array<number | string>>();
  });

  it('prefix array', () => {
    expectTypeOf(
      pipe(
        [1] as [number, ...Array<boolean>],
        takeWhile(constant($typed<boolean>())),
      ),
    ).toEqualTypeOf<Array<boolean | number>>();
  });

  it('suffix array', () => {
    expectTypeOf(
      pipe(
        [1] as [...Array<boolean>, number],
        takeWhile(constant($typed<boolean>())),
      ),
    ).toEqualTypeOf<Array<boolean | number>>();
  });

  it('array with suffix and prefix', () => {
    expectTypeOf(
      pipe(
        [1, 'a'] as [number, ...Array<boolean>, string],
        takeWhile(constant($typed<boolean>())),
      ),
    ).toEqualTypeOf<Array<boolean | number | string>>();
  });

  it('tuple', () => {
    expectTypeOf(
      pipe([1, 'a', true] as const, takeWhile(constant($typed<boolean>()))),
    ).toEqualTypeOf<Array<'a' | 1 | true>>();
  });

  it('union of arrays', () => {
    expectTypeOf(
      pipe([] as Array<boolean> | Array<string>, takeWhile(constant($typed<boolean>()))),
    ).toEqualTypeOf<Array<boolean | string>>();
  });

  it('trivial acceptor', () => {
    expectTypeOf(
      pipe([1, 'a'] as readonly [number, string], takeWhile(constant(true))),
    ).toEqualTypeOf<[number, string]>();
  });

  it('trivial rejector', () => {
    expectTypeOf(
      pipe([] as Array<number>, takeWhile(constant(false))),
    ).toEqualTypeOf<[]>();
  });

  it('assert type using predicate', () => {
    expectTypeOf(pipe([1, 'a'], takeWhile(isNumber))).toEqualTypeOf<Array<number>>();
  });

  it('guard on a tuple', () => {
    expectTypeOf(
      pipe([1, 'a', true] as const, takeWhile(isNumber)),
    ).toEqualTypeOf<Array<1>>();
  });

  it('guard on a union of arrays', () => {
    expectTypeOf(
      pipe([] as Array<string> | Array<number>, takeWhile(isString)),
    ).toEqualTypeOf<[] | Array<string>>();
  });

  it('guard on a union of tuples', () => {
    expectTypeOf(pipe([1] as [1] | ['a'], takeWhile(isNumber))).toEqualTypeOf<
      [] | [1]
    >();
  });

  it('guard on an empty tuple', () => {
    expectTypeOf(pipe([] as [], takeWhile(isString))).toEqualTypeOf<[]>();
  });

  it('guard matching every item of a tuple', () => {
    expectTypeOf(pipe([1, 2] as const, takeWhile(isNumber))).toEqualTypeOf<
      [1, 2]
    >();
  });

  it('guard matching every item of an array with suffix and prefix', () => {
    expectTypeOf(
      pipe([1, 2] as readonly [1, ...Array<number>, 2], takeWhile(isNumber)),
    ).toEqualTypeOf<[1, ...Array<number>, 2]>();
  });

  describe('predicate is typed correctly', () => {
    it('empty array', () => {
      pipe(
        [] as [],
        takeWhile((item, index, array) => {
          expectTypeOf(item).toEqualTypeOf<never>();
          expectTypeOf(index).toEqualTypeOf<number>();
          expectTypeOf(array).toEqualTypeOf<[]>();

          return true;
        }),
      );
    });

    it('regular array', () => {
      pipe(
        [] as Array<number>,
        takeWhile((item, index, array) => {
          expectTypeOf(item).toEqualTypeOf<number>();
          expectTypeOf(index).toEqualTypeOf<number>();
          expectTypeOf(array).toEqualTypeOf<Array<number>>();

          return true;
        }),
      );
    });

    it('regular array with union type', () => {
      pipe(
        [] as Array<number | string>,
        takeWhile((item, index, array) => {
          expectTypeOf(item).toEqualTypeOf<number | string>();
          expectTypeOf(index).toEqualTypeOf<number>();
          expectTypeOf(array).toEqualTypeOf<Array<number | string>>();

          return true;
        }),
      );
    });

    it('prefix array', () => {
      pipe(
        [1] as [number, ...Array<boolean>],
        takeWhile((item, index, array) => {
          expectTypeOf(item).toEqualTypeOf<boolean | number>();
          expectTypeOf(index).toEqualTypeOf<number>();
          expectTypeOf(array).toEqualTypeOf<[number, ...Array<boolean>]>();

          return true;
        }),
      );
    });

    it('suffix array', () => {
      pipe(
        [1] as [...Array<boolean>, number],
        takeWhile((item, index, array) => {
          expectTypeOf(item).toEqualTypeOf<boolean | number>();
          expectTypeOf(index).toEqualTypeOf<number>();
          expectTypeOf(array).toEqualTypeOf<[...Array<boolean>, number]>();

          return true;
        }),
      );
    });

    it('array with suffix and prefix', () => {
      pipe(
        [1, 'a'] as [number, ...Array<boolean>, string],
        takeWhile((item, index, array) => {
          expectTypeOf(item).toEqualTypeOf<boolean | number | string>();
          expectTypeOf(index).toEqualTypeOf<number>();
          expectTypeOf(array).toEqualTypeOf<[number, ...Array<boolean>, string]>();

          return true;
        }),
      );
    });

    it('tuple', () => {
      pipe(
        [1, 'a', true] as const,
        takeWhile((item, index, array) => {
          expectTypeOf(item).toEqualTypeOf<'a' | 1 | true>();
          expectTypeOf(index).toEqualTypeOf<number>();
          expectTypeOf(array).toEqualTypeOf<readonly [1, 'a', true]>();

          return true;
        }),
      );
    });

    it('union of arrays', () => {
      pipe(
        [] as Array<boolean> | Array<string>,
        takeWhile((item, index, array) => {
          expectTypeOf(item).toEqualTypeOf<boolean | string>();
          expectTypeOf(index).toEqualTypeOf<number>();
          expectTypeOf(array).toEqualTypeOf<Array<boolean> | Array<string>>();

          return true;
        }),
      );
    });
  });

  it('predicate wider than the item', () => {
    expectTypeOf(
      pipe([] as Array<string | null>, takeWhile(isNullish)),
    ).toEqualTypeOf<Array<null>>();
  });

  it('predicate disjoint from the item', () => {
    expectTypeOf(pipe([] as Array<string>, takeWhile(isNullish))).toEqualTypeOf<
      []
    >();
  });

  it('generic guard', () => {
    expectTypeOf(
      pipe(['a', 0] as Array<string | 0>, takeWhile(isTruthy)),
    ).toEqualTypeOf<Array<string>>();
  });

  it('negated guard', () => {
    expectTypeOf(
      pipe([1, 'a'] as Array<number | string>, takeWhile(isNot(isString))),
    ).toEqualTypeOf<Array<number>>();
  });

  it('guard incomparable to the item', () => {
    expectTypeOf(pipe([] as Array<Cat>, takeWhile(isLegged))).toEqualTypeOf<
      Array<Cat & Legged>
    >();
  });

  it('object guard sharing no keys with the item', () => {
    expectTypeOf(pipe([] as Array<Cat>, takeWhile(isNamed))).toEqualTypeOf<
      Array<Cat & Named>
    >();
  });
});
