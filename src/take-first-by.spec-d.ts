import { describe, expectTypeOf, it } from 'vitest';
import { identity } from './identity';
import { map } from './map';
import { pipe } from './pipe';
import { prop } from './prop';
import { takeFirstBy } from './take-first-by';

describe('dataFirst', () => {
  it('a projection typed on a supertype of the items', () => {
    expectTypeOf(
      takeFirstBy(
        [
          { a: 5, b: 'x' },
        ],
        1,
        (item: { readonly a: number }) => item.a,
      ),
    ).toEqualTypeOf<Array<{ a: number; b: string }>>();
  });
});

describe('dataLast', () => {
  it('a generic rule', () => {
    expectTypeOf(pipe([5, 1, 3], takeFirstBy(2, identity()))).toEqualTypeOf<
      Array<number>
    >();
  });

  it('a descending generic rule', () => {
    expectTypeOf(
      pipe([5, 1, 3], takeFirstBy(2, [
        identity(),
        'desc',
      ])),
    ).toEqualTypeOf<Array<number>>();
  });

  it('as a callback', () => {
    expectTypeOf(
      map([] as Array<ReadonlyArray<number>>, takeFirstBy(2, identity())),
    ).toEqualTypeOf<Array<Array<number>>>();
  });

  it('projections receive the items\' type', () => {
    pipe(
      [
        { a: 5 },
        { a: 1 },
      ],
      takeFirstBy(1, (item) => {
        expectTypeOf(item).toEqualTypeOf<{ a: number }>();

        return item.a;
      }),
    );
  });

  it('a projection typed on a supertype of the items', () => {
    expectTypeOf(
      pipe(
        [
          { a: 5, b: 'x' },
        ],
        takeFirstBy(1, (item: { readonly a: number }) => item.a),
      ),
    ).toEqualTypeOf<Array<{ a: number; b: string }>>();
  });

  it('a prop rule', () => {
    expectTypeOf(
      pipe([
        { a: 5, b: 'x' },
      ], takeFirstBy(1, prop('a'))),
    ).toEqualTypeOf<Array<{ a: number; b: string }>>();
  });
});
