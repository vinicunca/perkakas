import { describe, expectTypeOf, it } from 'vitest';
import { pipe } from './pipe';
import { uniqueBy } from './unique-by';

describe('callback data param', () => {
  it('complete in data-first', () => {
    uniqueBy([1, 2, 3] as const, (_item, _index, data) => {
      expectTypeOf(data).toEqualTypeOf<readonly [1, 2, 3]>();

      return 0;
    });
  });

  it('readonly for a mutable array in data-first', () => {
    uniqueBy([1, 2, 3] as Array<number>, (_item, _index, data) => {
      expectTypeOf(data).toEqualTypeOf<ReadonlyArray<number>>();

      return 0;
    });
  });

  it('lazily reconstructed in data-last', () => {
    pipe(
      [1, 2, 3] as const,
      uniqueBy((_item, _index, data) => {
        expectTypeOf(data).toEqualTypeOf<readonly [1, 2?, 3?]>();

        return 0;
      }),
    );
  });
});
