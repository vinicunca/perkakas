import { describe, expectTypeOf, it } from 'vitest';
import { constant } from './constant';
import { dropWhile } from './drop-while';
import { pipe } from './pipe';

describe('data-first', () => {
  it('empty array', () => {
    const result = dropWhile([] as [], constant(true));

    expectTypeOf(result).toEqualTypeOf<Array<never>>();
  });

  it('regular array', () => {
    const result = dropWhile([] as Array<number>, constant(true));

    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  it('regular array with union type', () => {
    const result = dropWhile([] as Array<number | string>, constant(true));

    expectTypeOf(result).toEqualTypeOf<Array<number | string>>();
  });

  it('prefix array', () => {
    const result = dropWhile(
      [1] as [number, ...Array<boolean>],
      constant(true),
    );

    expectTypeOf(result).toEqualTypeOf<Array<boolean | number>>();
  });

  it('suffix array', () => {
    const result = dropWhile(
      [1] as [...Array<boolean>, number],
      constant(true),
    );

    expectTypeOf(result).toEqualTypeOf<Array<boolean | number>>();
  });

  it('array with suffix and prefix', () => {
    const result = dropWhile(
      [1, 'a'] as [number, ...Array<boolean>, string],
      constant(true),
    );

    expectTypeOf(result).toEqualTypeOf<Array<boolean | number | string>>();
  });

  it('tuple', () => {
    const result = dropWhile([1, 'a', true] as const, constant(true));

    expectTypeOf(result).toEqualTypeOf<Array<'a' | 1 | true>>();
  });

  it('union of arrays', () => {
    const result = dropWhile(
      [] as Array<boolean> | Array<string>,
      constant(true),
    );

    expectTypeOf(result).toEqualTypeOf<Array<boolean | string>>();
  });
});

describe('data-last', () => {
  it('empty array', () => {
    const result = pipe([] as [], dropWhile(constant(true)));

    expectTypeOf(result).toEqualTypeOf<Array<never>>();
  });

  it('regular array', () => {
    const result = pipe([] as Array<number>, dropWhile(constant(true)));

    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  it('regular array with union type', () => {
    const result = pipe(
      [] as Array<number | string>,
      dropWhile(constant(true)),
    );

    expectTypeOf(result).toEqualTypeOf<Array<number | string>>();
  });

  it('prefix array', () => {
    const result = pipe(
      [1] as [number, ...Array<boolean>],
      dropWhile(constant(true)),
    );

    expectTypeOf(result).toEqualTypeOf<Array<boolean | number>>();
  });

  it('suffix array', () => {
    const result = pipe(
      [1] as [...Array<boolean>, number],
      dropWhile(constant(true)),
    );

    expectTypeOf(result).toEqualTypeOf<Array<boolean | number>>();
  });

  it('array with suffix and prefix', () => {
    const result = pipe(
      [1, 'a'] as [number, ...Array<boolean>, string],
      dropWhile(constant(true)),
    );

    expectTypeOf(result).toEqualTypeOf<Array<boolean | number | string>>();
  });

  it('tuple', () => {
    const result = pipe([1, 'a', true] as const, dropWhile(constant(true)));

    expectTypeOf(result).toEqualTypeOf<Array<'a' | 1 | true>>();
  });

  it('union of arrays', () => {
    const result = pipe(
      [] as Array<boolean> | Array<string>,
      dropWhile(constant(true)),
    );

    expectTypeOf(result).toEqualTypeOf<Array<boolean | string>>();
  });

  describe('predicate is typed correctly', () => {
    it('empty array', () => {
      pipe(
        [] as [],
        dropWhile((item, index, array) => {
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
        dropWhile((item, index, array) => {
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
        dropWhile((item, index, array) => {
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
        dropWhile((item, index, array) => {
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
        dropWhile((item, index, array) => {
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
        dropWhile((item, index, array) => {
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
        dropWhile((item, index, array) => {
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
        dropWhile((item, index, array) => {
          expectTypeOf(item).toEqualTypeOf<boolean | string>();
          expectTypeOf(index).toEqualTypeOf<number>();
          expectTypeOf(array).toEqualTypeOf<Array<boolean> | Array<string>>();

          return true;
        }),
      );
    });
  });
});
