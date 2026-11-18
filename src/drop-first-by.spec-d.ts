import { describe, expectTypeOf, it } from 'vitest';
import { dropFirstBy } from './drop-first-by';
import { identity } from './identity';
import { map } from './map';
import { pipe } from './pipe';
import { prop } from './prop';

describe('dataFirst', () => {
  it('a projection typed on a supertype of the items', () => {
    expectTypeOf(
      dropFirstBy([
        { a: 5, b: 'x' },
      ], 1, ({ a }: { readonly a: number }) => a),
    ).toEqualTypeOf<Array<{ a: number; b: string }>>();
  });
});

describe('dataLast', () => {
  it('a generic rule', () => {
    expectTypeOf(pipe([5, 1, 3], dropFirstBy(2, identity()))).toEqualTypeOf<
      Array<number>
    >();
  });

  it('a descending generic rule', () => {
    expectTypeOf(
      pipe([5, 1, 3], dropFirstBy(2, [
        identity(),
        'desc',
      ])),
    ).toEqualTypeOf<Array<number>>();
  });

  it('as a callback', () => {
    expectTypeOf(
      map([] as Array<ReadonlyArray<number>>, dropFirstBy(2, identity())),
    ).toEqualTypeOf<Array<Array<number>>>();
  });

  it('projections receive the items\' type', () => {
    pipe(
      [
        { a: 5 },
        { a: 1 },
      ],
      dropFirstBy(1, (item) => {
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
        dropFirstBy(1, ({ a }: { readonly a: number }) => a),
      ),
    ).toEqualTypeOf<Array<{ a: number; b: string }>>();
  });

  it('a prop rule', () => {
    expectTypeOf(
      pipe([
        { a: 5, b: 'x' },
      ], dropFirstBy(1, prop('a'))),
    ).toEqualTypeOf<Array<{ a: number; b: string }>>();
  });
});
