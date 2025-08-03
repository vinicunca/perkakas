import type { Tagged } from 'type-fest';
import { describe, expectTypeOf, it } from 'vitest';
import { constant } from './constant';
import { mapValues } from './map-values';
import { pipe } from './pipe';

describe('interface', () => {
  it('should set the type of the key to be the union of the keys of the object', () => {
    mapValues({} as { foo: unknown; bar: unknown }, (_, key) =>
      expectTypeOf(key).toEqualTypeOf<'bar' | 'foo'>());
  });

  it('should exclude symbols from keys', () => {
    const mySymbol = Symbol('mySymbol');
    mapValues(
      {} as { [mySymbol]: unknown; foo: unknown; bar: unknown },
      (_, key) => expectTypeOf(key).toEqualTypeOf<'bar' | 'foo'>(),
    );
  });
});

describe('mapped type', () => {
  it('should work with string keys', () => {
    mapValues({} as Record<string, unknown>, (_, key) => {
      expectTypeOf(key).toEqualTypeOf<string>();
    });
  });

  it('should work with number keys', () => {
    mapValues({} as Record<number, unknown>, (_, key) => {
      expectTypeOf(key).toEqualTypeOf<`${number}`>();
    });
  });

  it('should work with template literal string keys', () => {
    mapValues({} as Record<`prefix${string}`, unknown>, (_, key) => {
      expectTypeOf(key).toEqualTypeOf<`prefix${string}`>();
    });
  });

  it('should not work with symbol keys', () => {
    mapValues({} as Record<symbol, unknown>, (_, key) => {
      expectTypeOf(key).toEqualTypeOf<never>();
    });
  });
});

describe('indexed signature', () => {
  it('should work with string keys', () => {
    mapValues({} as Record<string, unknown>, (_, key) => {
      expectTypeOf(key).toEqualTypeOf<string>();
    });
  });

  it('should work with number keys', () => {
    mapValues({} as Record<number, unknown>, (_, key) => {
      expectTypeOf(key).toEqualTypeOf<`${number}`>();
    });
  });

  it('should work with template literal string keys', () => {
    mapValues({} as Record<`prefix${string}`, unknown>, (_, key) => {
      expectTypeOf(key).toEqualTypeOf<`prefix${string}`>();
    });
  });

  it('should not work with symbol keys', () => {
    mapValues({} as Record<symbol, unknown>, (_, key) => {
      expectTypeOf(key).toEqualTypeOf<never>();
    });
  });
});

describe('branded types', () => {
  it('should infer types correctly in the mapper', () => {
    type UserID = Tagged<string, symbol>;

    const userValues: Record<UserID, number> = {
      ['U1' as UserID]: 1,
      ['U2' as UserID]: 2,
    };

    mapValues(userValues, (value, key) => {
      expectTypeOf(value).toEqualTypeOf<number>();
      expectTypeOf(key).toEqualTypeOf<UserID>();
    });
  });
});

it('symbols are filtered out', () => {
  const mySymbol = Symbol('mySymbol');

  expectTypeOf(
    mapValues({ [mySymbol]: 1, a: 'hello' }, constant(true)),
  ).toEqualTypeOf<{ a: true }>();
});

it('symbols are ignored by the mapper', () => {
  mapValues({ [Symbol('a')]: 'hello', b: 1, c: true }, (value, key) => {
    expectTypeOf(value).toEqualTypeOf<boolean | number>();
    expectTypeOf(key).toEqualTypeOf<'b' | 'c'>();
  });
});

it('objects with just symbol keys are still well defined', () => {
  const result = mapValues({ [Symbol('a')]: 1 }, constant(true));

  // eslint-disable-next-line ts/no-empty-object-type
  expectTypeOf(result).toEqualTypeOf<{}>();
});

it('number keys are converted to string in the mapper', () => {
  mapValues({ 123: 456 }, (value, key) => {
    expectTypeOf(value).toEqualTypeOf<number>();
    expectTypeOf(key).toEqualTypeOf<'123'>();

    return 'world';
  });
});

it('number keys are preserved in the resulting object', () => {
  const data = {} as Record<number, unknown>;

  expectTypeOf(mapValues(data, constant(true))).toEqualTypeOf<
    Record<number, true>
  >();
  expectTypeOf(pipe(data, mapValues(constant(true)))).toEqualTypeOf<
    Record<number, true>
  >();
});

it('maintains partiality', () => {
  expectTypeOf(
    mapValues(
      {} as { a?: number; b?: string; c: number; d: string },
      constant(true),
    ),
  ).toEqualTypeOf<{ a?: true; b?: true; c: true; d: true }>();
});

it('unions of records', () => {
  const data = {} as Record<number, unknown> | Record<string, unknown>;

  const dataFirst = mapValues(data, constant('hello' as string));

  expectTypeOf(dataFirst).toEqualTypeOf<
    Record<number, string> | Record<string, string>
  >();

  const dataLast = pipe(data, mapValues(constant('hello' as string)));

  expectTypeOf(dataLast).toEqualTypeOf<
    Record<number, string> | Record<string, string>
  >();
});
