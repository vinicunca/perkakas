import type { Simplify } from 'type-fest';
import { describe, expectTypeOf, it } from 'vitest';
import { constant } from './constant';
import { fromKeys } from './from-keys';
import { pipe } from './pipe';

type Letter
  = | 'a'
    | 'b'
    | 'c'
    | 'd'
    | 'e'
    | 'f'
    | 'g'
    | 'h'
    | 'i'
    | 'j'
    | 'k'
    | 'l'
    | 'm'
    | 'n'
    | 'o'
    | 'p'
    | 'q'
    | 'r'
    | 's'
    | 't'
    | 'u'
    | 'v'
    | 'w'
    | 'x'
    | 'y'
    | 'z';

it('empty array', () => {
  const data = [] as const;

  const dataFirst = fromKeys(data, constant(1));
  // eslint-disable-next-line ts/no-empty-object-type
  expectTypeOf(dataFirst).toEqualTypeOf<{}>();

  const dataLast = pipe(data, fromKeys(constant(1)));
  // eslint-disable-next-line ts/no-empty-object-type
  expectTypeOf(dataLast).toEqualTypeOf<{}>();
});

it('fixed tuple', () => {
  const data = ['cat', 'dog'] as const;

  const dataFirst = fromKeys(data, constant(1));
  expectTypeOf(dataFirst).toEqualTypeOf<Record<'cat' | 'dog', number>>();

  const dataLast = pipe(data, fromKeys(constant(1)));
  expectTypeOf(dataLast).toEqualTypeOf<Record<'cat' | 'dog', number>>();
});

describe('with simple keys', () => {
  it('regular array', () => {
    const data = [] as Array<string>;

    const dataFirst = fromKeys(data, constant(1));
    expectTypeOf(dataFirst).toEqualTypeOf<Record<string, number>>();

    const dataLast = pipe(data, fromKeys(constant(1)));
    expectTypeOf(dataLast).toEqualTypeOf<Record<string, number>>();
  });

  it('non-empty array', () => {
    const data = ['cat'] as [string, ...Array<string>];

    const dataFirst = fromKeys(data, constant(1));
    expectTypeOf(dataFirst).toEqualTypeOf<Record<string, number>>();

    const dataLast = pipe(data, fromKeys(constant(1)));
    expectTypeOf(dataLast).toEqualTypeOf<Record<string, number>>();
  });

  it('fixed tuple', () => {
    const data = ['cat', 'dog'] as [string, string];

    const dataFirst = fromKeys(data, constant(1));
    expectTypeOf(dataFirst).toEqualTypeOf<Record<string, number>>();

    const dataLast = pipe(data, fromKeys(constant(1)));
    expectTypeOf(dataLast).toEqualTypeOf<Record<string, number>>();
  });
});

describe('with literal union keys', () => {
  it('regular array', () => {
    const data = [] as Array<'cat' | 'dog'>;

    const dataFirst = fromKeys(data, constant(1));
    expectTypeOf(dataFirst).toEqualTypeOf<
      Partial<Record<'cat' | 'dog', number>>
    >();

    const dataLast = pipe(data, fromKeys(constant(1)));
    expectTypeOf(dataLast).toEqualTypeOf<
      Partial<Record<'cat' | 'dog', number>>
    >();
  });

  it('non-empty array', () => {
    const data = ['cat'] as ['cat' | 'dog', ...Array<'mouse' | 'pig'>];

    const dataFirst = fromKeys(data, constant(1));
    expectTypeOf(dataFirst).toEqualTypeOf<
      Simplify<
        Partial<Record<'mouse' | 'pig', number>>
        & ({ cat: number } | { dog: number })
      >
    >();

    const dataLast = pipe(data, fromKeys(constant(1)));
    expectTypeOf(dataLast).toEqualTypeOf<
      Simplify<
        Partial<Record<'mouse' | 'pig', number>>
        & ({ cat: number } | { dog: number })
      >
    >();
  });

  it('fixed tuple', () => {
    const data = ['cat', 'mouse'] as ['cat' | 'dog', 'mouse' | 'pig'];

    const dataFirst = fromKeys(data, constant(1));
    expectTypeOf(dataFirst).toEqualTypeOf<
      Simplify<
        ({ cat: number } | { dog: number })
        & ({ mouse: number } | { pig: number })
      >
    >();

    const dataLast = pipe(data, fromKeys(constant(1)));
    expectTypeOf(dataLast).toEqualTypeOf<
      Simplify<
        ({ cat: number } | { dog: number })
        & ({ mouse: number } | { pig: number })
      >
    >();
  });
});

describe('with string template keys', () => {
  it('regular array', () => {
    const data = [] as Array<`prefix_${number}`>;

    const dataFirst = fromKeys(data, constant(1));
    expectTypeOf(dataFirst).toEqualTypeOf<Record<`prefix_${number}`, number>>();

    const dataLast = pipe(data, fromKeys(constant(1)));
    expectTypeOf(dataLast).toEqualTypeOf<Record<`prefix_${number}`, number>>();
  });

  it('non-empty array', () => {
    const data = ['prefix_1'] as [
      `prefix_${number}`,
      ...Array<`prefix_${number}`>,
    ];

    const dataFirst = fromKeys(data, constant(1));
    expectTypeOf(dataFirst).toEqualTypeOf<Record<`prefix_${number}`, number>>();

    const dataLast = pipe(data, fromKeys(constant(1)));
    expectTypeOf(dataLast).toEqualTypeOf<Record<`prefix_${number}`, number>>();
  });

  it('fixed tuple', () => {
    const data = ['prefix_1', '2_suffix'] as [
      `prefix_${number}`,
      `${number}_suffix`,
    ];

    const dataFirst = fromKeys(data, constant(1));
    expectTypeOf(dataFirst).toEqualTypeOf<
      Record<`${number}_suffix` | `prefix_${number}`, number>
    >();

    const dataLast = pipe(data, fromKeys(constant(1)));
    expectTypeOf(dataLast).toEqualTypeOf<
      Record<`${number}_suffix` | `prefix_${number}`, number>
    >();
  });

  describe('number keys', () => {
    it('regular array', () => {
      const data = [] as Array<number>;

      const dataFirst = fromKeys(data, constant(1));
      expectTypeOf(dataFirst).toEqualTypeOf<Record<number, number>>();

      const dataLast = pipe(data, fromKeys(constant(1)));
      expectTypeOf(dataLast).toEqualTypeOf<Record<number, number>>();
    });

    it('non-empty array', () => {
      const data = [1] as [number, ...Array<number>];

      const dataFirst = fromKeys(data, constant(1));
      expectTypeOf(dataFirst).toEqualTypeOf<Record<number, number>>();

      const dataLast = pipe(data, fromKeys(constant(1)));
      expectTypeOf(dataLast).toEqualTypeOf<Record<number, number>>();
    });

    it('fixed tuple', () => {
      const data = [1, 2] as [number, number];

      const dataFirst = fromKeys(data, constant(1));
      expectTypeOf(dataFirst).toEqualTypeOf<Record<number, number>>();

      const dataLast = pipe(data, fromKeys(constant(1)));
      expectTypeOf(dataLast).toEqualTypeOf<Record<number, number>>();
    });

    it('literals', () => {
      const data = [1, 2, 3] as const;

      const dataFirst = fromKeys(data, constant(1));
      expectTypeOf(dataFirst).toEqualTypeOf<Record<1 | 2 | 3, number>>();

      const dataLast = pipe(data, fromKeys(constant(1)));
      expectTypeOf(dataLast).toEqualTypeOf<Record<1 | 2 | 3, number>>();
    });
  });
});

it('typescript doesn\'t choke on huge literal unions', () => {
  const data = [] as Array<`${Letter}${Letter}`>;

  const dataFirst = fromKeys(data, constant(1));
  expectTypeOf(dataFirst).toEqualTypeOf<
    Partial<Record<`${Letter}${Letter}`, number>>
  >();

  const dataLast = pipe(data, fromKeys(constant(1)));
  expectTypeOf(dataLast).toEqualTypeOf<
    Partial<Record<`${Letter}${Letter}`, number>>
  >();
});
