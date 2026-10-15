import type { Tagged } from 'type-fest';
import type { CatClass, LeggedClass, NamedClass } from '../../../test/classes';
import type { Cat, Legged, Named } from '../../../test/interfaces';
import type { Narrowed } from './narrowed';
import { describe, expectTypeOf, it } from 'vitest';
import { $typed } from '../../../test/$typed';

declare function narrowed<const T0, const T1>(t0: T0, t1: T1): Narrowed<T0, T1>;

it('identical types', () => {
  expectTypeOf(
    narrowed($typed<string>(), $typed<string>()),
  ).toEqualTypeOf<string>();
});

describe('one type extends the other', () => {
  it('first is narrower', () => {
    expectTypeOf(narrowed('a', $typed<string>())).toEqualTypeOf<'a'>();
  });

  it('second is narrower', () => {
    expectTypeOf(narrowed($typed<string>(), 'a')).toEqualTypeOf<'a'>();
  });

  it('interface narrower than a type literal', () => {
    expectTypeOf(
      narrowed($typed<Cat>(), $typed<{ readonly legs: number }>()),
    ).toEqualTypeOf<Cat>();
  });

  it('function satisfies an object type through `Function`\'s props', () => {
    expectTypeOf(narrowed($typed<() => void>(), $typed<Named>())).toEqualTypeOf<
      () => void
    >();
  });
});

describe('incomparable types', () => {
  it('primitives', () => {
    expectTypeOf(
      narrowed($typed<string>(), $typed<number>()),
    ).toEqualTypeOf<never>();
  });

  it('disjoint literals', () => {
    expectTypeOf(narrowed('a', 'b')).toEqualTypeOf<never>();
  });

  it('primitive and object', () => {
    expectTypeOf(
      narrowed($typed<string>(), $typed<Cat>()),
    ).toEqualTypeOf<never>();
  });

  it('functions', () => {
    expectTypeOf(
      narrowed($typed<() => string>(), $typed<() => number>()),
    ).toEqualTypeOf<never>();
  });

  it('function and an object', () => {
    expectTypeOf(
      narrowed($typed<() => void>(), $typed<Cat>()),
    ).toEqualTypeOf<never>();
  });

  it('function and an array', () => {
    expectTypeOf(
      narrowed($typed<() => void>(), $typed<Array<string>>()),
    ).toEqualTypeOf<never>();
  });

  it('branded strings', () => {
    expectTypeOf(
      narrowed($typed<Tagged<string, 'a'>>(), $typed<Tagged<string, 'b'>>()),
    ).toEqualTypeOf<Tagged<string, 'a'> & Tagged<string, 'b'>>();
  });

  it('branded string and an object sharing a prop', () => {
    expectTypeOf(
      narrowed($typed<Tagged<string, 'a'>>(), $typed<{ readonly length: 3 }>()),
    ).toEqualTypeOf<never>();
  });

  it('branded numbers', () => {
    expectTypeOf(
      narrowed($typed<Tagged<number, 'a'>>(), $typed<Tagged<number, 'b'>>()),
    ).toEqualTypeOf<Tagged<number, 'a'> & Tagged<number, 'b'>>();
  });

  it('branded number and an object', () => {
    expectTypeOf(
      narrowed($typed<Tagged<number, 'a'>>(), $typed<Cat>()),
    ).toEqualTypeOf<never>();
  });

  it('branded boolean and an object', () => {
    expectTypeOf(
      narrowed($typed<Tagged<boolean, 'a'>>(), $typed<Cat>()),
    ).toEqualTypeOf<never>();
  });

  it('branded bigint and an object', () => {
    expectTypeOf(
      narrowed($typed<Tagged<bigint, 'a'>>(), $typed<Cat>()),
    ).toEqualTypeOf<never>();
  });

  it('branded symbol and an object', () => {
    expectTypeOf(
      narrowed($typed<Tagged<symbol, 'a'>>(), $typed<Cat>()),
    ).toEqualTypeOf<never>();
  });
});

describe('template literals', () => {
  it('literal extends the template', () => {
    expectTypeOf(
      narrowed('abc', $typed<`a${string}`>()),
    ).toEqualTypeOf<'abc'>();
  });

  it('literal disjoint from the template', () => {
    expectTypeOf(
      narrowed('foo', $typed<`bar${string}`>()),
    ).toEqualTypeOf<never>();
  });

  it('overlapping templates', () => {
    expectTypeOf(
      narrowed($typed<`a${string}`>(), $typed<`${string}b`>()),
    ).toEqualTypeOf<`a${string}` & `${string}b`>();
  });

  it('disjoint templates', () => {
    expectTypeOf(
      narrowed($typed<`foo_${number}`>(), $typed<`hello${string}`>()),
    ).toEqualTypeOf<`foo_${number}` & `hello${string}`>();
  });
});

describe('unions', () => {
  it('union on the first type', () => {
    expectTypeOf(narrowed($typed<'a' | 'b'>(), 'a')).toEqualTypeOf<'a'>();
  });

  it('union on the second type', () => {
    expectTypeOf(narrowed('a', $typed<'a' | 'b'>())).toEqualTypeOf<'a'>();
  });

  it('overlapping unions', () => {
    expectTypeOf(
      narrowed($typed<'a' | 'b'>(), $typed<'b' | 'c'>()),
    ).toEqualTypeOf<'b'>();
  });

  it('disjoint unions', () => {
    expectTypeOf(
      narrowed($typed<'a' | 'b'>(), $typed<'c' | 'd'>()),
    ).toEqualTypeOf<never>();
  });

  it('union wider than the other type', () => {
    expectTypeOf(narrowed($typed<string>(), $typed<'a' | 'b'>())).toEqualTypeOf<
      'a' | 'b'
    >();
  });

  it('boolean distributes as a union of its literals', () => {
    expectTypeOf(narrowed($typed<boolean>(), true)).toEqualTypeOf<true>();
  });

  it('union of objects on the first type', () => {
    expectTypeOf(
      narrowed(
        $typed<{ readonly a: string } | { readonly b: number }>(),
        $typed<{ readonly a: string }>(),
      ),
    ).toEqualTypeOf<
      { readonly a: string } | ({ readonly b: number } & { readonly a: string })
    >();
  });

  it('union of objects on the second type', () => {
    expectTypeOf(
      narrowed(
        $typed<{ readonly a: string }>(),
        $typed<{ readonly a: string } | { readonly b: number }>(),
      ),
    ).toEqualTypeOf<{ readonly a: string }>();
  });
});

describe('top and bottom types', () => {
  it('any as the first type', () => {
    expectTypeOf(
      // eslint-disable-next-line ts/no-explicit-any -- Testing how the type reacts to `any` is the point of this test.
      narrowed($typed<any>(), $typed<string>()),
    ).toEqualTypeOf<string>();
  });

  it('any as the second type', () => {
    expectTypeOf(
      // eslint-disable-next-line ts/no-explicit-any -- Testing how the type reacts to `any` is the point of this test.
      narrowed($typed<string>(), $typed<any>()),
    ).toEqualTypeOf<string>();
  });

  it('any as both types', () => {
    expectTypeOf(
      // eslint-disable-next-line ts/no-explicit-any -- Testing how the type reacts to `any` is the point of this test.
      narrowed($typed<any>(), $typed<any>()),
      // eslint-disable-next-line ts/no-explicit-any -- Testing how the type reacts to `any` is the point of this test.
    ).toEqualTypeOf<any>();
  });

  it('unknown as the first type', () => {
    expectTypeOf(
      narrowed($typed<unknown>(), $typed<string>()),
    ).toEqualTypeOf<string>();
  });

  it('unknown as the second type', () => {
    expectTypeOf(
      narrowed($typed<string>(), $typed<unknown>()),
    ).toEqualTypeOf<string>();
  });

  it('never as the first type', () => {
    expectTypeOf(
      narrowed($typed<never>(), $typed<string>()),
    ).toEqualTypeOf<never>();
  });

  it('never as the second type', () => {
    expectTypeOf(
      narrowed($typed<string>(), $typed<never>()),
    ).toEqualTypeOf<never>();
  });
});

describe('objects', () => {
  it('one object extends the other', () => {
    expectTypeOf(
      narrowed(
        $typed<{ readonly a: string; readonly b: number }>(),
        $typed<{ readonly a: string }>(),
      ),
    ).toEqualTypeOf<{ readonly a: string; readonly b: number }>();
  });

  it('incomparable objects with common props', () => {
    expectTypeOf(
      narrowed(
        $typed<{ readonly a: string; readonly b: number }>(),
        $typed<{ readonly a: string; readonly c: boolean }>(),
      ),
    ).toEqualTypeOf<
      {
        readonly a: string;
        readonly b: number;
      } & {
        readonly a: string;
        readonly c: boolean;
      }
    >();
  });

  it('incomparable objects without common props', () => {
    expectTypeOf(
      narrowed(
        $typed<{ readonly a: string }>(),
        $typed<{ readonly b: number }>(),
      ),
    ).toEqualTypeOf<{ readonly a: string } & { readonly b: number }>();
  });

  it('incomparable objects with a conflicting common prop', () => {
    expectTypeOf(
      narrowed(
        $typed<{ readonly a: string; readonly b: number }>(),
        $typed<{ readonly a: number; readonly c: boolean }>(),
      ),
    ).toEqualTypeOf<
      {
        readonly a: string;
        readonly b: number;
      } & {
        readonly a: number;
        readonly c: boolean;
      }
    >();
  });

  // Sharing a key doesn't prove the intersection is inhabited; when the shared
  // key's literal types conflict TypeScript reduces it for us.
  it('conflicting literal common prop', () => {
    expectTypeOf(
      narrowed(
        $typed<{ readonly a: 'cat' }>(),
        $typed<{ readonly a: 'dog' }>(),
      ),
    ).toEqualTypeOf<never>();
  });

  it('index-signature type and an interface', () => {
    expectTypeOf(
      narrowed($typed<Record<string, unknown>>(), $typed<Cat>()),
    ).toEqualTypeOf<Record<string, unknown> & Cat>();
  });

  it('incomparable interfaces without common props', () => {
    expectTypeOf(narrowed($typed<Cat>(), $typed<Named>())).toEqualTypeOf<
      Cat & Named
    >();
  });

  it('incomparable interfaces with common props', () => {
    expectTypeOf(narrowed($typed<Cat>(), $typed<Legged>())).toEqualTypeOf<
      Cat & Legged
    >();
  });

  it('incomparable classes without common props', () => {
    expectTypeOf(
      narrowed($typed<CatClass>(), $typed<NamedClass>()),
    ).toEqualTypeOf<CatClass & NamedClass>();
  });

  it('incomparable classes with common props', () => {
    expectTypeOf(
      narrowed($typed<CatClass>(), $typed<LeggedClass>()),
    ).toEqualTypeOf<CatClass & LeggedClass>();
  });
});

describe('arrays', () => {
  it('one array extends the other', () => {
    expectTypeOf(
      narrowed($typed<Array<string>>(), $typed<Array<string | number>>()),
    ).toEqualTypeOf<Array<string>>();
  });

  it('incomparable arrays', () => {
    expectTypeOf(
      narrowed($typed<Array<string>>(), $typed<Array<number>>()),
    ).toEqualTypeOf<never>();
  });

  // Arrays share props with object types (e.g. `length`) but the intersection
  // fallback intentionally skips them.
  it('array and an incomparable object sharing a prop', () => {
    expectTypeOf(
      narrowed($typed<Array<string>>(), $typed<{ readonly length: 3 }>()),
    ).toEqualTypeOf<never>();
  });

  it('tuples of different lengths', () => {
    expectTypeOf(
      narrowed($typed<[string, number]>(), $typed<[string]>()),
    ).toEqualTypeOf<never>();
  });

  it('mutable array extends the readonly array', () => {
    expectTypeOf(
      narrowed($typed<Array<string>>(), $typed<ReadonlyArray<string>>()),
    ).toEqualTypeOf<Array<string>>();
  });

  it('mutable tuple extends the readonly tuple', () => {
    expectTypeOf(
      narrowed($typed<[string]>(), $typed<readonly [string]>()),
    ).toEqualTypeOf<[string]>();
  });
});

describe('argument order doesn\'t matter', () => {
  it('incomparable objects with common props', () => {
    expectTypeOf(
      narrowed(
        $typed<{ readonly a: string; readonly c: boolean }>(),
        $typed<{ readonly a: string; readonly b: number }>(),
      ),
    ).toEqualTypeOf<
      {
        readonly a: string;
        readonly c: boolean;
      } & {
        readonly a: string;
        readonly b: number;
      }
    >();
  });

  it('array and an incomparable object sharing a prop', () => {
    expectTypeOf(
      narrowed($typed<{ readonly length: 3 }>(), $typed<Array<string>>()),
    ).toEqualTypeOf<never>();
  });

  it('branded string and an object sharing a prop', () => {
    expectTypeOf(
      narrowed($typed<{ readonly length: 3 }>(), $typed<Tagged<string, 'a'>>()),
    ).toEqualTypeOf<never>();
  });

  it('branded number and an object', () => {
    expectTypeOf(
      narrowed($typed<Cat>(), $typed<Tagged<number, 'a'>>()),
    ).toEqualTypeOf<never>();
  });

  it('index-signature type and an interface', () => {
    expectTypeOf(
      narrowed($typed<Cat>(), $typed<Record<string, unknown>>()),
    ).toEqualTypeOf<Cat & Record<string, unknown>>();
  });

  it('function and an object', () => {
    expectTypeOf(
      narrowed($typed<Cat>(), $typed<() => void>()),
    ).toEqualTypeOf<never>();
  });

  it('function and an array', () => {
    expectTypeOf(
      narrowed($typed<Array<string>>(), $typed<() => void>()),
    ).toEqualTypeOf<never>();
  });
});
