import { describe, expectTypeOf, it } from 'vitest';
import { constant } from './constant';
import { isNumber } from './is-number';
import { pipe } from './pipe';
import { takeLastWhile } from './take-last-while';

describe('data-first', () => {
  it('empty array', () => {
    const result = takeLastWhile([] as [], constant(true));

    expectTypeOf(result).toEqualTypeOf<Array<never>>();
  });

  it('regular array', () => {
    const result = takeLastWhile([] as Array<number>, constant(true));

    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  it('regular array with union type', () => {
    const result = takeLastWhile([] as Array<number | string>, constant(true));

    expectTypeOf(result).toEqualTypeOf<Array<number | string>>();
  });

  it('prefix array', () => {
    const result = takeLastWhile(
      [1] as [number, ...Array<boolean>],
      constant(true),
    );

    expectTypeOf(result).toEqualTypeOf<Array<boolean | number>>();
  });

  it('suffix array', () => {
    const result = takeLastWhile(
      [1] as [...Array<boolean>, number],
      constant(true),
    );

    expectTypeOf(result).toEqualTypeOf<Array<boolean | number>>();
  });

  it('array with suffix and prefix', () => {
    const result = takeLastWhile(
      [1, 'a'] as [number, ...Array<boolean>, string],
      constant(true),
    );

    expectTypeOf(result).toEqualTypeOf<Array<boolean | number | string>>();
  });

  it('tuple', () => {
    const result = takeLastWhile([1, 'a', true] as const, constant(true));

    expectTypeOf(result).toEqualTypeOf<Array<'a' | 1 | true>>();
  });

  it('union of arrays', () => {
    const result = takeLastWhile(
      [] as Array<boolean> | Array<string>,
      constant(true),
    );

    expectTypeOf(result).toEqualTypeOf<Array<boolean | string>>();
  });

  it('assert type using predicate', () => {
    const result = takeLastWhile([1, 'a'], isNumber);

    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });
});

describe('data-last', () => {
  it('empty array', () => {
    const result = pipe([] as [], takeLastWhile(constant(true)));

    expectTypeOf(result).toEqualTypeOf<Array<never>>();
  });

  it('regular array', () => {
    const result = pipe([] as Array<number>, takeLastWhile(constant(true)));

    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  it('regular array with union type', () => {
    const result = pipe(
      [] as Array<number | string>,
      takeLastWhile(constant(true)),
    );

    expectTypeOf(result).toEqualTypeOf<Array<number | string>>();
  });

  it('prefix array', () => {
    const result = pipe(
      [1] as [number, ...Array<boolean>],
      takeLastWhile(constant(true)),
    );

    expectTypeOf(result).toEqualTypeOf<Array<boolean | number>>();
  });

  it('suffix array', () => {
    const result = pipe(
      [1] as [...Array<boolean>, number],
      takeLastWhile(constant(true)),
    );

    expectTypeOf(result).toEqualTypeOf<Array<boolean | number>>();
  });

  it('array with suffix and prefix', () => {
    const result = pipe(
      [1, 'a'] as [number, ...Array<boolean>, string],
      takeLastWhile(constant(true)),
    );

    expectTypeOf(result).toEqualTypeOf<Array<boolean | number | string>>();
  });

  it('tuple', () => {
    const result = pipe([1, 'a', true] as const, takeLastWhile(constant(true)));

    expectTypeOf(result).toEqualTypeOf<Array<'a' | 1 | true>>();
  });

  it('union of arrays', () => {
    const result = pipe(
      [] as Array<boolean> | Array<string>,
      takeLastWhile(constant(true)),
    );

    expectTypeOf(result).toEqualTypeOf<Array<boolean | string>>();
  });

  it('assert type using predicate', () => {
    const result = pipe([1, 'a'], takeLastWhile(isNumber));

    expectTypeOf(result).toEqualTypeOf<Array<number>>();
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
          expectTypeOf(array).toEqualTypeOf<
            [number, ...Array<boolean>, string]
          >();

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
});
