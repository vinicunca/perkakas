import { describe, expect, it } from 'vitest';
import { countBy } from './count-by';
import { pipe } from './pipe';
import { prop } from './prop';

describe('dataFirst', () => {
  it('countBy', () => {
    const data = [1, 2, 3, 2, 1, 5];
    const result = countBy(data, (x) => x);

    expect(result).toStrictEqual({ 1: 2, 2: 2, 3: 1, 5: 1 });
  });

  it('array of strings', () => {
    const data = ['a', 'b', 'c', 'B', 'A', 'a'];
    const result = countBy(data, (x) => x.toLowerCase());

    expect(result).toStrictEqual({ a: 3, b: 2, c: 1 });
  });

  it('array of objects', () => {
    const data = [
      { id: 1, category: 'A' },
      { id: 2, category: 'B' },
      { id: 3, category: 'A' },
    ];
    const result = countBy(data, (x) => x.category);

    expect(result).toStrictEqual({ A: 2, B: 1 });
  });

  it('symbols', () => {
    const mySymbolA = Symbol('mySymbolA');
    const mySymbolB = Symbol('mySymbolB');
    const data = [mySymbolA, mySymbolB, mySymbolA];
    const result = countBy(data, (x) => x);

    expect(result).toStrictEqual({ [mySymbolA]: 2, [mySymbolB]: 1 });
  });

  it('mixed data types', () => {
    const mySymbol = Symbol('mySymbol');
    const data = [1, 'a', 1, mySymbol, 'A', mySymbol];
    const result = countBy(data, (x) =>
      typeof x === 'string' ? x.toLowerCase() : x);

    expect(result).toStrictEqual({ 1: 2, a: 2, [mySymbol]: 2 });
  });

  it('indexed', () => {
    const data = [1, 2, 3, 2, 1];
    const result = countBy(data, (_, index) =>
      index % 2 === 0 ? 'even' : 'odd');

    expect(result).toStrictEqual({ even: 3, odd: 2 });
  });
});

describe('dataLast', () => {
  it('countBy', () => {
    const data = [1, 2, 3, 2, 1, 5];
    const result = pipe(
      data,
      countBy((x) => x),
    );

    expect(result).toStrictEqual({ 1: 2, 2: 2, 3: 1, 5: 1 });
  });

  it('array of strings', () => {
    const data = ['a', 'b', 'c', 'B', 'A', 'a'];
    const result = pipe(
      data,
      countBy((x) => x.toLowerCase()),
    );

    expect(result).toStrictEqual({ a: 3, b: 2, c: 1 });
  });

  it('array of objects', () => {
    const data = [
      { id: 1, category: 'A' },
      { id: 2, category: 'B' },
      { id: 3, category: 'A' },
    ];
    const result = pipe(
      data,
      countBy((x) => x.category),
    );

    expect(result).toStrictEqual({ A: 2, B: 1 });
  });

  it('symbols', () => {
    const mySymbolA = Symbol('mySymbolA');
    const mySymbolB = Symbol('mySymbolB');
    const data = [mySymbolA, mySymbolB, mySymbolA];
    const result = pipe(
      data,
      countBy((x) => x),
    );

    expect(result).toStrictEqual({ [mySymbolA]: 2, [mySymbolB]: 1 });
  });

  it('mixed data types', () => {
    const mySymbol = Symbol('mySymbol');
    const data = [1, 'a', 1, mySymbol, 'A', mySymbol];
    const result = pipe(
      data,
      countBy((x) => (typeof x === 'string' ? x.toLowerCase() : x)),
    );

    expect(result).toStrictEqual({ 1: 2, a: 2, [mySymbol]: 2 });
  });

  it('indexed', () => {
    const data = [1, 2, 3, 2, 1];
    const result = pipe(
      data,
      countBy((_, index) => (index % 2 === 0 ? 'even' : 'odd')),
    );

    expect(result).toStrictEqual({ even: 3, odd: 2 });
  });
});

it('empty array', () => {
  const result = countBy([], (x) => x);

  expect(result).toStrictEqual({});
});

it('category is an object instance method name', () => {
  const data = [
    { a: 'toString', b: 'toString' },
    { a: 'toString', b: 'valueOf' },
    { a: 'valueOf', b: 'toString' },
    { a: 'toString', b: '__proto__' },
  ];
  const result = countBy(data, prop('a'));

  expect(result).toStrictEqual({ toString: 3, valueOf: 1 });
});
