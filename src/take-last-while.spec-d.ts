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
import { takeLastWhile } from './take-last-while';

describe('data-first', () => {
  it('empty array', () => {
    expectTypeOf(
      takeLastWhile([] as [], constant($typed<boolean>())),
    ).toEqualTypeOf<Array<never>>();
  });

  it('regular array', () => {
    expectTypeOf(
      takeLastWhile([] as Array<number>, constant($typed<boolean>())),
    ).toEqualTypeOf<Array<number>>();
  });

  it('regular array with union type', () => {
    expectTypeOf(
      takeLastWhile([] as Array<number | string>, constant($typed<boolean>())),
    ).toEqualTypeOf<Array<number | string>>();
  });

  it('prefix array', () => {
    expectTypeOf(
      takeLastWhile([1] as [number, ...Array<boolean>], constant($typed<boolean>())),
    ).toEqualTypeOf<Array<boolean | number>>();
  });

  it('suffix array', () => {
    expectTypeOf(
      takeLastWhile([1] as [...Array<boolean>, number], constant($typed<boolean>())),
    ).toEqualTypeOf<Array<boolean | number>>();
  });

  it('array with suffix and prefix', () => {
    expectTypeOf(
      takeLastWhile(
        [1, 'a'] as [number, ...Array<boolean>, string],
        constant($typed<boolean>()),
      ),
    ).toEqualTypeOf<Array<boolean | number | string>>();
  });

  it('tuple', () => {
    expectTypeOf(
      takeLastWhile([1, 'a', true] as const, constant($typed<boolean>())),
    ).toEqualTypeOf<Array<'a' | 1 | true>>();
  });

  it('union of arrays', () => {
    expectTypeOf(
      takeLastWhile([] as Array<boolean> | Array<string>, constant($typed<boolean>())),
    ).toEqualTypeOf<Array<boolean | string>>();
  });

  it('trivial acceptor', () => {
    expectTypeOf(
      takeLastWhile([1, 'a'] as readonly [number, string], constant(true)),
    ).toEqualTypeOf<[number, string]>();
  });

  it('trivial rejector', () => {
    expectTypeOf(takeLastWhile([] as Array<number>, constant(false))).toEqualTypeOf<
      []
    >();
  });

  it('assert type using predicate', () => {
    expectTypeOf(takeLastWhile([1, 'a'], isNumber)).toEqualTypeOf<Array<number>>();
  });

  it('guard on a tuple', () => {
    expectTypeOf(
      takeLastWhile([1, 'a', true] as const, isNumber),
    ).toEqualTypeOf<Array<1>>();
  });

  it('guard on a union of arrays', () => {
    expectTypeOf(
      takeLastWhile([] as Array<string> | Array<number>, isString),
    ).toEqualTypeOf<[] | Array<string>>();
  });

  it('guard on a union of tuples', () => {
    expectTypeOf(takeLastWhile([1] as [1] | ['a'], isNumber)).toEqualTypeOf<
      [] | [1]
    >();
  });

  it('guard on an empty tuple', () => {
    expectTypeOf(takeLastWhile([] as [], isString)).toEqualTypeOf<[]>();
  });

  it('guard matching every item of a tuple', () => {
    expectTypeOf(takeLastWhile([1, 2] as const, isNumber)).toEqualTypeOf<
      [1, 2]
    >();
  });

  it('guard matching every item of an array with suffix and prefix', () => {
    expectTypeOf(
      takeLastWhile([1, 2] as readonly [1, ...Array<number>, 2], isNumber),
    ).toEqualTypeOf<[1, ...Array<number>, 2]>();
  });

  it('predicate is typed correctly', () => {
    takeLastWhile([] as Array<number | string>, (item, index, array) => {
      expectTypeOf(item).toEqualTypeOf<number | string>();
      expectTypeOf(index).toEqualTypeOf<number>();
      expectTypeOf(array).toEqualTypeOf<Array<number | string>>();

      return true;
    });
  });

  it('predicate wider than the item', () => {
    expectTypeOf(
      takeLastWhile([] as Array<string | null>, isNullish),
    ).toEqualTypeOf<Array<null>>();
  });

  it('predicate disjoint from the item', () => {
    expectTypeOf(takeLastWhile([] as Array<string>, isNullish)).toEqualTypeOf<[]>();
  });

  it('generic guard', () => {
    expectTypeOf(
      takeLastWhile(['a', 0] as Array<string | 0>, isTruthy),
    ).toEqualTypeOf<Array<string>>();
  });

  it('negated guard', () => {
    expectTypeOf(
      takeLastWhile([1, 'a'] as Array<number | string>, isNot(isString)),
    ).toEqualTypeOf<Array<number>>();
  });

  it('guard incomparable to the item', () => {
    expectTypeOf(takeLastWhile([] as Array<Cat>, isLegged)).toEqualTypeOf<
      Array<Cat & Legged>
    >();
  });

  it('object guard sharing no keys with the item', () => {
    expectTypeOf(takeLastWhile([] as Array<Cat>, isNamed)).toEqualTypeOf<
      Array<Cat & Named>
    >();
  });

  it('`unknown` data', () => {
    expectTypeOf(takeLastWhile([] as Array<unknown>, isString)).toEqualTypeOf<
      Array<string>
    >();
  });

  it('predicate with a mismatched param is an error', () => {
    // @ts-expect-error [ts2769] -- The predicate must accept the item type.
    takeLastWhile([] as Array<number>, (x: string) => x.length > 0);
  });
});

describe('data-last', () => {
  it('empty array', () => {
    expectTypeOf(
      pipe([] as [], takeLastWhile(constant($typed<boolean>()))),
    ).toEqualTypeOf<Array<never>>();
  });

  it('regular array', () => {
    expectTypeOf(
      pipe([] as Array<number>, takeLastWhile(constant($typed<boolean>()))),
    ).toEqualTypeOf<Array<number>>();
  });

  it('regular array with union type', () => {
    expectTypeOf(
      pipe(
        [] as Array<number | string>,
        takeLastWhile(constant($typed<boolean>())),
      ),
    ).toEqualTypeOf<Array<number | string>>();
  });

  it('prefix array', () => {
    expectTypeOf(
      pipe(
        [1] as [number, ...Array<boolean>],
        takeLastWhile(constant($typed<boolean>())),
      ),
    ).toEqualTypeOf<Array<boolean | number>>();
  });

  it('suffix array', () => {
    expectTypeOf(
      pipe(
        [1] as [...Array<boolean>, number],
        takeLastWhile(constant($typed<boolean>())),
      ),
    ).toEqualTypeOf<Array<boolean | number>>();
  });

  it('array with suffix and prefix', () => {
    expectTypeOf(
      pipe(
        [1, 'a'] as [number, ...Array<boolean>, string],
        takeLastWhile(constant($typed<boolean>())),
      ),
    ).toEqualTypeOf<Array<boolean | number | string>>();
  });

  it('tuple', () => {
    expectTypeOf(
      pipe([1, 'a', true] as const, takeLastWhile(constant($typed<boolean>()))),
    ).toEqualTypeOf<Array<'a' | 1 | true>>();
  });

  it('union of arrays', () => {
    expectTypeOf(
      pipe(
        [] as Array<boolean> | Array<string>,
        takeLastWhile(constant($typed<boolean>())),
      ),
    ).toEqualTypeOf<Array<boolean | string>>();
  });

  it('trivial acceptor', () => {
    expectTypeOf(
      pipe(
        [1, 'a'] as readonly [number, string],
        takeLastWhile(constant(true)),
      ),
    ).toEqualTypeOf<[number, string]>();
  });

  it('trivial rejector', () => {
    expectTypeOf(
      pipe([] as Array<number>, takeLastWhile(constant(false))),
    ).toEqualTypeOf<[]>();
  });

  it('assert type using predicate', () => {
    expectTypeOf(pipe([1, 'a'], takeLastWhile(isNumber))).toEqualTypeOf<
      Array<number>
    >();
  });

  it('guard on a tuple', () => {
    expectTypeOf(
      pipe([1, 'a', true] as const, takeLastWhile(isNumber)),
    ).toEqualTypeOf<Array<1>>();
  });

  it('guard on a union of arrays', () => {
    expectTypeOf(
      pipe([] as Array<string> | Array<number>, takeLastWhile(isString)),
    ).toEqualTypeOf<[] | Array<string>>();
  });

  it('guard on a union of tuples', () => {
    expectTypeOf(
      pipe([1] as [1] | ['a'], takeLastWhile(isNumber)),
    ).toEqualTypeOf<[] | [1]>();
  });

  it('guard on an empty tuple', () => {
    expectTypeOf(pipe([] as [], takeLastWhile(isString))).toEqualTypeOf<[]>();
  });

  it('guard matching every item of a tuple', () => {
    expectTypeOf(pipe([1, 2] as const, takeLastWhile(isNumber))).toEqualTypeOf<
      [1, 2]
    >();
  });

  it('guard matching every item of an array with suffix and prefix', () => {
    expectTypeOf(
      pipe([1, 2] as readonly [1, ...Array<number>, 2], takeLastWhile(isNumber)),
    ).toEqualTypeOf<[1, ...Array<number>, 2]>();
  });

  describe('predicate is typed correctly', () => {
    it('empty array', () => {
      pipe(
        [] as [],
        takeLastWhile((item, index, array) => {
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
        takeLastWhile((item, index, array) => {
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
        takeLastWhile((item, index, array) => {
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
        takeLastWhile((item, index, array) => {
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
        takeLastWhile((item, index, array) => {
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
        takeLastWhile((item, index, array) => {
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
        takeLastWhile((item, index, array) => {
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
        takeLastWhile((item, index, array) => {
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
      pipe([] as Array<string | null>, takeLastWhile(isNullish)),
    ).toEqualTypeOf<Array<null>>();
  });

  it('predicate disjoint from the item', () => {
    expectTypeOf(pipe([] as Array<string>, takeLastWhile(isNullish))).toEqualTypeOf<
      []
    >();
  });

  it('generic guard', () => {
    expectTypeOf(
      pipe(['a', 0] as Array<string | 0>, takeLastWhile(isTruthy)),
    ).toEqualTypeOf<Array<string>>();
  });

  it('negated guard', () => {
    expectTypeOf(
      pipe([1, 'a'] as Array<number | string>, takeLastWhile(isNot(isString))),
    ).toEqualTypeOf<Array<number>>();
  });

  it('guard incomparable to the item', () => {
    expectTypeOf(pipe([] as Array<Cat>, takeLastWhile(isLegged))).toEqualTypeOf<
      Array<Cat & Legged>
    >();
  });

  it('object guard sharing no keys with the item', () => {
    expectTypeOf(pipe([] as Array<Cat>, takeLastWhile(isNamed))).toEqualTypeOf<
      Array<Cat & Named>
    >();
  });
});
