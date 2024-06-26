import { addProp } from './add-prop';
import { pipe } from './pipe';

describe('runtime', () => {
  describe('data first', () => {
    it('simple', () => {
      const actual = addProp({ a: 1 }, 'b', 2);
      expect(actual).toEqual({ a: 1, b: 2 });
    });
  });

  describe('data last', () => {
    it('simple', () => {
      const actual = pipe({ a: 1 }, addProp('b', 2));
      expect(actual).toEqual({ a: 1, b: 2 });
    });
  });
});

describe('typing', () => {
  it('allows redefining prop types', () => {
    const result = addProp({} as { a: string }, 'a', 1);
    expectTypeOf(result).toEqualTypeOf<{ a: number }>();
  });

  it('makes optional fields required', () => {
    const result = addProp({} as { a?: string }, 'a', 'hello');
    expectTypeOf(result).toEqualTypeOf<{ a: string }>();
  });

  it('allows setting an unknown prop', () => {
    const result = addProp({ a: 'foo' }, 'b', 'bar');
    expectTypeOf(result).toEqualTypeOf<{ a: string; b: string }>();
  });

  it('sets literal unions as optional', () => {
    const result = addProp({} as { a: string }, 'b' as 'b' | 'c', 123);
    expectTypeOf(result).toEqualTypeOf<{ a: string; b?: number; c?: number }>();
  });

  it('keeps the prop optional when the key isn\'t literal', () => {
    const result = addProp(
      {} as { a?: string; b?: number },
      'a' as 'a' | 'b',
      'foo' as const,
    );
    expectTypeOf(result).toEqualTypeOf<{ a?: string; b?: number | 'foo' }>();
  });

  it('works on simple objects', () => {
    const result = addProp({} as Record<string, string>, 'a', 'foo' as const);
    expectTypeOf(result).toEqualTypeOf<{ [x: string]: string; a: 'foo' }>();
  });
});
