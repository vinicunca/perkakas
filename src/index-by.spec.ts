import { describe, expect, it, vi } from 'vitest';
import { constant } from './constant';
import { identity } from './identity';
import { indexBy } from './index-by';
import { pipe } from './pipe';
import { prop } from './prop';

it('dataFirst', () => {
  expect(
    indexBy(
      [
        { dir: 'left', code: 97 },
        { dir: 'right', code: 100 },
      ],
      prop('code'),
    ),
  ).toStrictEqual({
    97: { dir: 'left', code: 97 },
    100: { dir: 'right', code: 100 },
  });
});

it('dataLast', () => {
  expect(
    pipe(
      [
        { dir: 'left', code: 97 },
        { dir: 'right', code: 100 },
      ],
      indexBy(prop('code')),
    ),
  ).toStrictEqual({
    97: { dir: 'left', code: 97 },
    100: { dir: 'right', code: 100 },
  });
});

it('empty array', () => {
  expect(indexBy([], constant('a'))).toStrictEqual({});
});

it('single item', () => {
  expect(indexBy(['a'], identity())).toStrictEqual({ a: 'a' });
});

it('prototype is Object.prototype', () => {
  expect(Object.getPrototypeOf(indexBy(['a'], identity()))).toBe(
    Object.prototype,
  );
});

it('the last item with a key wins', () => {
  expect(
    indexBy(
      [
        { id: 'a', value: 1 },
        { id: 'a', value: 2 },
      ],
      prop('id'),
    ),
  ).toStrictEqual({
    a: { id: 'a', value: 2 },
  });
});

it('key order', () => {
  const mySymbol = Symbol('mySymbol');

  expect(
    Reflect.ownKeys(indexBy(['b', '10', mySymbol, 'a', '2', 'b'], identity())),
  ).toStrictEqual(['2', '10', 'b', 'a', mySymbol]);
});

it('number keys share the property of their string form', () => {
  expect(indexBy([1, '1'], identity())).toStrictEqual({ 1: '1' });
});

describe('`__proto__` key', () => {
  it('keeps the prototype', () => {
    expect(
      Object.getPrototypeOf(indexBy([
        { id: '__proto__' },
      ], prop('id'))),
    ).toBe(Object.prototype);
  });

  it('with an object item is an own property', () => {
    expect(
      Reflect.ownKeys(indexBy([
        { id: '__proto__' },
      ], prop('id'))),
    ).toStrictEqual(['__proto__']);
  });

  it('with a null item keeps the prototype', () => {
    expect(Object.getPrototypeOf(indexBy([null], constant('__proto__')))).toBe(
      Object.prototype,
    );
  });

  it('with a primitive item is an own property', () => {
    expect(Object.entries(indexBy(['a'], constant('__proto__')))).toStrictEqual(
      [
        ['__proto__', 'a'],
      ],
    );
  });
});

it('calls the mapper once per item, in order, with the whole input', () => {
  const data = ['a', 'b', 'c'];
  const mapper
    = vi.fn<(item: string, index: number, data: ReadonlyArray<string>) => string>(
      identity(),
    );

  indexBy(data, mapper);

  expect(mapper.mock.calls).toStrictEqual([
    ['a', 0, data],
    ['b', 1, data],
    ['c', 2, data],
  ]);
});

it('empty array in a pipe', () => {
  expect(pipe([], indexBy(constant('a')))).toStrictEqual({});
});

it('prototype is Object.prototype in a pipe', () => {
  expect(Object.getPrototypeOf(pipe(['a'], indexBy(identity())))).toBe(
    Object.prototype,
  );
});
