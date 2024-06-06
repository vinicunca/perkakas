import { find } from './find';
import { isString } from './is-string';
import { map } from './map';
import { pipe } from './pipe';

describe('runtime', () => {
  describe('data first', () => {
    it('find', () => {
      expect(
        find(
          [
            { a: 1, b: 1 },
            { a: 1, b: 2 },
            { a: 2, b: 1 },
            { a: 1, b: 3 },
          ],
          ({ b }) => b === 2,
        ),
      ).toEqual({ a: 1, b: 2 });
    });

    it('indexed ', () => {
      expect(
        find(
          [
            { a: 1, b: 1 },
            { a: 1, b: 2 },
            { a: 2, b: 1 },
            { a: 1, b: 3 },
          ],
          ({ b }, idx) => b === 2 && idx === 1,
        ),
      ).toEqual({ a: 1, b: 2 });
    });
  });

  describe('data last', () => {
    it('find', () => {
      const counter = vi.fn(
        (x: { readonly a: number; readonly b: number }) => x,
      );

      const actual = pipe(
        [
          { a: 1, b: 1 },
          { a: 1, b: 2 },
          { a: 2, b: 1 },
          { a: 1, b: 3 },
        ],
        map(counter),
        find(({ b }) => b === 2),
      );

      expect(counter).toHaveBeenCalledTimes(2);
      expect(actual).toEqual({ a: 1, b: 2 });
    });

    it('indexed', () => {
      const counter = vi.fn(
        (x: { readonly a: number; readonly b: number }) => x,
      );

      const actual = pipe(
        [
          { a: 1, b: 1 },
          { a: 1, b: 2 },
          { a: 2, b: 1 },
          { a: 1, b: 3 },
        ],
        map(counter),
        find(({ b }, idx) => b === 2 && idx === 1),
      );
      expect(counter).toHaveBeenCalledTimes(2);
      expect(actual).toEqual({ a: 1, b: 2 });
    });
  });
});

describe('typing', () => {
  it('can narrow types', () => {
    const result = find([1, 'a'], isString);
    expectTypeOf(result).toEqualTypeOf<string | undefined>();
  });
});
