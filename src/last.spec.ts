import { last } from './last';
import { pipe } from './pipe';

describe('last', () => {
  describe('data first', () => {
    it('should return last', () => {
      expect(last([1, 2, 3])).toBe(3);
    });

    it('empty array', () => {
      expect(last([])).toBeUndefined();
    });
  });

  describe('data last', () => {
    it('should return last', () => {
      expect(pipe([1, 2, 3], last())).toBe(3);
    });

    it('empty array', () => {
      expect(pipe([], last())).toBeUndefined();
    });
  });

  describe('types', () => {
    it('works with empty arrays', () => {
      const result = last([] as const);
      expectTypeOf(result).toEqualTypeOf<never>();
    });

    it('works with regular arrays', () => {
      const result = last([1, 2, 3] as Array<number>);
      expectTypeOf(result).toEqualTypeOf<number | undefined>();
    });

    it('works with non-empty arrays', () => {
      const result = last([1] as [number, ...Array<number>]);
      expectTypeOf(result).toEqualTypeOf<number>();
    });

    it('should infer type in pipes', () => {
      const result = pipe('this is a text', (text) => [...text], last());
      expectTypeOf(result).toEqualTypeOf<string | undefined>();
    });

    it('can infer last type from const arrays', () => {
      const result = last([3, 'a', false] as const);
      expectTypeOf(result).toEqualTypeOf<false>();
    });

    it('a bit more complex example', () => {
      const result = last([['a', 1] as const, true, { foo: 'bar' }] as const);
      expectTypeOf(result).toEqualTypeOf<{ readonly foo: 'bar' }>();
    });
  });
});
