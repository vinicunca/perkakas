import { describe, expectTypeOf, it } from 'vitest';
import { omit } from './omit';
import { pipe } from './pipe';

describe('data first', () => {
  it('non existing prop', () => {
    // @ts-expect-error [ts2322] -- should not allow non existing props
    omit({ a: 1, b: 2, c: 3, d: 4 }, ['not', 'in'] as const);
  });

  it('complex type', () => {
    const obj = { a: 1 } as { a: number } | { a?: number; b: string };
    const result = omit(obj, ['a']);
    expectTypeOf(result).toEqualTypeOf<
      Omit<{ a: number } | { a?: number; b: string }, 'a'>
    >();
  });
});

describe('data last', () => {
  it('non existing prop', () => {
    pipe(
      { a: 1, b: 2, c: 3, d: 4 },
      // @ts-expect-error [ts2345] -- should not allow non existing props
      omit(['not', 'in'] as const),
    );
  });

  it('complex type', () => {
    const obj = { a: 1 } as { a: number } | { a?: number; b: string };
    const result = pipe(obj, omit(['a']));
    expectTypeOf(result).toEqualTypeOf<
      Omit<{ a: number } | { a?: number; b: string }, 'a'>
    >();
  });
});

it('multiple keys', () => {
  interface Data {
    aProp: string;
    bProp: string;
  }

  const obj: Data = {
    aProp: 'p1',

    bProp: 'p2',
  };

  const result = pipe(obj, omit(['aProp', 'bProp']));

  expectTypeOf(result).toEqualTypeOf<Omit<Data, 'aProp' | 'bProp'>>();
});
