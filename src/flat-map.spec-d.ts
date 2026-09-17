import { describe, expectTypeOf, it } from 'vitest';
import { flatMap } from './flat-map';
import { pipe } from './pipe';

describe('callback data param', () => {
  it('complete in data-first', () => {
    flatMap([1, 2, 3], (_input, _index, data) => {
      expectTypeOf(data).toEqualTypeOf<ReadonlyArray<number>>();

      return [0];
    });
  });

  it('lazily reconstructed in data-last', () => {
    pipe(
      [1, 2, 3],
      flatMap((_input, _index, data) => {
        expectTypeOf(data).toEqualTypeOf<readonly [number, ...Array<number>]>();

        return [0];
      }),
    );
  });
});
