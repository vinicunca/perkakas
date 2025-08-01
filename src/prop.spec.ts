import { describe, expect, it } from 'vitest';
import { indexBy } from './index-by';
import { pipe } from './pipe';
import { prop } from './prop';

it('data-first', () => {
  expect(prop({ foo: 'bar' }, 'foo')).toBe('bar');
});

it('data-last', () => {
  expect(pipe({ foo: 'bar' }, prop('foo'))).toBe('bar');
});

it('factory function', () => {
  const propA = prop('a');

  expect(indexBy([{ a: 1 }, { a: 2 }], propA)).toStrictEqual({
    1: { a: 1 },
    2: { a: 2 },
  });
});

it('deep prop', () => {
  const DATA = {
    a: { b: { c: { d: { e: { f: { g: { h: { i: { j: 10 } } } } } } } } },
  } as const;

  expect(prop(DATA, 'a')).toStrictEqual({
    b: { c: { d: { e: { f: { g: { h: { i: { j: 10 } } } } } } } },
  });
  expect(prop(DATA, 'a', 'b')).toStrictEqual({
    c: { d: { e: { f: { g: { h: { i: { j: 10 } } } } } } },
  });
  expect(prop(DATA, 'a', 'b', 'c')).toStrictEqual({
    d: { e: { f: { g: { h: { i: { j: 10 } } } } } },
  });
  expect(prop(DATA, 'a', 'b', 'c', 'd')).toStrictEqual({
    e: { f: { g: { h: { i: { j: 10 } } } } },
  });
  expect(prop(DATA, 'a', 'b', 'c', 'd', 'e')).toStrictEqual({
    f: { g: { h: { i: { j: 10 } } } },
  });
  expect(prop(DATA, 'a', 'b', 'c', 'd', 'e', 'f')).toStrictEqual({
    g: { h: { i: { j: 10 } } },
  });
  expect(prop(DATA, 'a', 'b', 'c', 'd', 'e', 'f', 'g')).toStrictEqual({
    h: { i: { j: 10 } },
  });
  expect(prop(DATA, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h')).toStrictEqual({
    i: { j: 10 },
  });
  expect(prop(DATA, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i')).toStrictEqual(
    { j: 10 },
  );
  expect(prop(DATA, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j')).toBe(10);
});

it('stops at optional props', () => {
  expect(
    prop(
      { a: { b: { c: {} } } } as {
        a?: { b?: { c?: { d?: { e?: { f?: { g?: { h?: number } } } } } } };
      },
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
      'h',
    ),
  ).toBeUndefined();
});

it('multi-dimensional arrays', () => {
  const data = [[[['cat']]]] as Array<Array<Array<Array<'cat'>>>>;

  expect(prop(data, 0)).toStrictEqual([[['cat']]]);
  expect(prop(data, 0, 0)).toStrictEqual([['cat']]);
  expect(prop(data, 0, 0, 0)).toStrictEqual(['cat']);
  expect(prop(data, 0, 0, 0, 0)).toBe('cat');
});

it('mixed arrays and objects', () => {
  const data = [{ a: 'cat' }, { b: 'dog' }, { c: 'mouse' }] as const;

  expect(prop(data, 0)).toStrictEqual({ a: 'cat' });
  expect(prop(data, 0, 'a')).toBe('cat');
  expect(prop(data, 1)).toStrictEqual({ b: 'dog' });
  expect(prop(data, 1, 'b')).toBe('dog');
  expect(prop(data, 2)).toStrictEqual({ c: 'mouse' });
  expect(prop(data, 2, 'c')).toBe('mouse');
});

// @see https://github.com/lodash/lodash/blob/4.17/test/test.js#L19394
describe('lodash spec', () => {
  it('should get string keyed property values', () => {
    expect(prop({ a: 1 }, 'a')).toBe(1);
  });

  it('should get symbol keyed property values', () => {
    const mySymbol = Symbol('mySymbol');

    expect(prop({ [mySymbol]: 1 }, mySymbol)).toBe(1);
  });

  it('should get deep property values', () => {
    expect(prop({ a: { b: 2 } }, 'a', 'b')).toBe(2);
  });

  it('should get a key over a path', () => {
    expect(prop({ 'a.b': 1, 'a': { b: 2 } }, 'a.b')).toBe(1);
  });

  it('should not coerce array paths to strings', () => {
    expect(prop({ 'a,b,c': 3, 'a': { b: { c: 4 } } }, 'a', 'b', 'c')).toBe(4);
  });

  it('should not ignore empty brackets', () => {
    expect(prop({ a: { '': 1 } }, 'a', '')).toBe(1);
  });

  it('should handle empty paths', () => {
    expect(prop({ '': 3 }, '')).toBe(3);
  });

  it('should handle complex paths', () => {
    expect(
      prop(
        {
          a: {
            '-1.23': {
              '["b"]': { c: { '[\'d\']': { '\ne\n': { f: { g: 8 } } } } },
            },
          },
        },
        'a',
        '-1.23',
        '["b"]',
        'c',
        '[\'d\']',
        '\ne\n',
        'f',
        'g',
      ),
    ).toBe(8);
  });

  it('should return `undefined` when `object` is nullish', () => {
    expect(prop(null as { a: 123 } | null, 'a')).toBeUndefined();
    expect(prop(undefined as { a: 123 } | undefined, 'a')).toBeUndefined();
  });

  it('should return `undefined` for deep paths when `object` is nullish', () => {
    expect(
      prop(null as { a: { b: { c: 123 } } } | null, 'a', 'b', 'c'),
    ).toBeUndefined();
    expect(
      prop(undefined as { a: { b: { c: 123 } } } | undefined, 'a', 'b', 'c'),
    ).toBeUndefined();
  });

  it('should return `undefined` if parts of `path` are missing', () => {
    expect(
      prop(
        { a: [{ b: { c: 123 } }, null] } as {
          a: Array<{ b: { c: number } } | null>;
        },
        'a',
        1,
        'b',
        'c',
      ),
    ).toBeUndefined();
  });

  it('should be able to return `null` values', () => {
    expect(prop({ a: { b: null } }, 'a', 'b')).toBeNull();
  });

  it('should follow `path` over non-plain objects', () => {
    class MyInnerClass {
      public b = 123 as number;
    }

    class MyOuterClass {
      public a: MyInnerClass = new MyInnerClass();
    }

    expect(prop(new MyOuterClass(), 'a', 'b')).toBe(123);
  });
});
