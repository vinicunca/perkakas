import { invert } from './invert';
import { pipe } from './pipe';

describe('data first', () => {
  it('empty object', () => {
    expect(invert({})).toEqual({});
  });

  it('no duplicate values', () => {
    expect(invert({ a: 'd', b: 'e', c: 'f' })).toEqual({
      d: 'a',
      e: 'b',
      f: 'c',
    });
  });

  it('duplicate values', () => {
    expect(invert({ a: 'd', b: 'e', c: 'd' })).toEqual({ e: 'b', d: 'c' });
  });

  it('numeric values', () => {
    expect(invert(['a', 'b', 'c'])).toEqual({ a: '0', b: '1', c: '2' });
  });

  it('symbol keys are filtered out', () => {
    expect(invert({ [Symbol('a')]: 4, a: 'hello' })).toEqual({ hello: 'a' });
  });

  it('number keys are converted to strings', () => {
    expect(invert({ 1: 'a', 2: 'b' })).toEqual({ a: '1', b: '2' });
  });

  it('symbol values are fine', () => {
    const mySymbol = Symbol('my');
    expect(invert({ a: mySymbol })).toEqual({ [mySymbol]: 'a' });
  });
});

describe('data last', () => {
  it('empty object', () => {
    expect(pipe({}, invert())).toEqual({});
  });

  it('no duplicate values', () => {
    expect(pipe({ a: 'd', b: 'e', c: 'f' }, invert())).toEqual({
      d: 'a',
      e: 'b',
      f: 'c',
    });
  });

  it('duplicate values', () => {
    expect(pipe({ a: 'd', b: 'e', c: 'd' }, invert())).toEqual({
      e: 'b',
      d: 'c',
    });
  });

  it('numeric values', () => {
    expect(pipe(['a', 'b', 'c'], invert())).toEqual({
      a: '0',
      b: '1',
      c: '2',
    });
  });
});

describe('typing', () => {
  it('simple string records', () => {
    const result = invert({} as Record<string, string>);
    expectTypeOf(result).toEqualTypeOf<Record<string, string>>();
  });

  it('simple number records', () => {
    const result = invert({} as Record<number, number>);
    expectTypeOf(result).toEqualTypeOf<Record<number, `${number}`>>();
  });

  it('mixed const objects', () => {
    const result = invert({ a: 123, b: 'hello', 3: 456, 4: 'world' } as const);
    expectTypeOf(result).toEqualTypeOf<{
      123: 'a';
      hello: 'b';
      456: '3';
      world: '4';
    }>();
  });

  it('optional props', () => {
    const result = invert({} as { a?: 'hello'; b?: 123; 3?: 'world'; 4?: 456 });
    expectTypeOf(result).toEqualTypeOf<{
      hello?: 'a';
      123?: 'b';
      world?: '3';
      456?: '4';
    }>();
  });

  it('partial record', () => {
    const result = invert({} as Partial<Record<123 | 456, 'cat' | 'dog'>>);
    expectTypeOf(result).toEqualTypeOf<
      Partial<Record<'cat' | 'dog', '123' | '456'>>
    >();
  });

  it('symbol keys are filtered out', () => {
    const result = invert({ [Symbol('a')]: 4, a: 'hello' } as const);
    expectTypeOf(result).toEqualTypeOf<{ hello: 'a' }>();
  });

  it('number keys are converted to strings', () => {
    const result = invert({ 1: 'a', 2: 'b' });
    expectTypeOf(result).toEqualTypeOf<Record<string, '1' | '2'>>();
  });

  it('symbol values are fine', () => {
    const mySymbol = Symbol('my');
    const result = invert({ a: mySymbol } as const);
    expectTypeOf(result).toEqualTypeOf<{ [mySymbol]: 'a' }>();
  });

  it('only symbol keys', () => {
    const mySymbol = Symbol('my');
    const result = invert({ [mySymbol]: 4 });
    // eslint-disable-next-line ts/ban-types
    expectTypeOf(result).toEqualTypeOf<{}>();
  });
});
