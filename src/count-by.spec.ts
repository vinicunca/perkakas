import { describe, expect, it } from 'vitest';
import { constant } from './constant';
import { countBy } from './count-by';
import { identity } from './identity';
import { isStrictEqual } from './is-strict-equal';
import { isString } from './is-string';
import { pipe } from './pipe';
import { prop } from './prop';
import { toLowerCase } from './to-lower-case';
import { when } from './when';

describe('dataFirst', () => {
  it('countBy', () => {
    expect(countBy([1, 2, 3, 2, 1, 5], identity())).toStrictEqual({
      1: 2,
      2: 2,
      3: 1,
      5: 1,
    });
  });

  it('array of strings', () => {
    expect(
      countBy(['a', 'b', 'c', 'B', 'A', 'a'], toLowerCase()),
    ).toStrictEqual({ a: 3, b: 2, c: 1 });
  });

  it('array of objects', () => {
    expect(
      countBy(
        [
          { id: 1, category: 'A' },
          { id: 2, category: 'B' },
          { id: 3, category: 'A' },
        ],
        prop('category'),
      ),
    ).toStrictEqual({ A: 2, B: 1 });
  });

  it('symbols', () => {
    const mySymbolA = Symbol('mySymbolA');
    const mySymbolB = Symbol('mySymbolB');

    expect(
      countBy([mySymbolA, mySymbolB, mySymbolA], identity()),
    ).toStrictEqual({
      [mySymbolA]: 2,
      [mySymbolB]: 1,
    });
  });

  it('mixed data types', () => {
    const mySymbol = Symbol('mySymbol');

    expect(
      countBy(
        [1, 'a', 1, mySymbol, 'A', mySymbol],
        when(isString, toLowerCase()),
      ),
    ).toStrictEqual({ 1: 2, a: 2, [mySymbol]: 2 });
  });

  it('indexed', () => {
    expect(
      countBy([1, 2, 3, 2, 1], (_, index) =>
        index % 2 === 0 ? 'even' : 'odd'),
    ).toStrictEqual({ even: 3, odd: 2 });
  });
});

describe('dataLast', () => {
  it('countBy', () => {
    expect(pipe([1, 2, 3, 2, 1, 5], countBy(identity()))).toStrictEqual({
      1: 2,
      2: 2,
      3: 1,
      5: 1,
    });
  });

  it('array of strings', () => {
    expect(
      pipe(['a', 'b', 'c', 'B', 'A', 'a'], countBy(toLowerCase())),
    ).toStrictEqual({ a: 3, b: 2, c: 1 });
  });

  it('array of objects', () => {
    expect(
      pipe(
        [
          { id: 1, category: 'A' },
          { id: 2, category: 'B' },
          { id: 3, category: 'A' },
        ],
        countBy(prop('category')),
      ),
    ).toStrictEqual({ A: 2, B: 1 });
  });

  it('symbols', () => {
    const mySymbolA = Symbol('mySymbolA');
    const mySymbolB = Symbol('mySymbolB');

    expect(
      pipe([mySymbolA, mySymbolB, mySymbolA], countBy(identity())),
    ).toStrictEqual({ [mySymbolA]: 2, [mySymbolB]: 1 });
  });

  it('mixed data types', () => {
    const mySymbol = Symbol('mySymbol');

    expect(
      pipe(
        [1, 'a', 1, mySymbol, 'A', mySymbol],
        countBy(when(isString, toLowerCase())),
      ),
    ).toStrictEqual({ 1: 2, a: 2, [mySymbol]: 2 });
  });

  it('indexed', () => {
    expect(
      pipe(
        [1, 2, 3, 2, 1],
        countBy((_, index) => (index % 2 === 0 ? 'even' : 'odd')),
      ),
    ).toStrictEqual({ even: 3, odd: 2 });
  });
});

it('empty array', () => {
  expect(countBy([], identity())).toStrictEqual({});
});

it('category is an object instance method name', () => {
  expect(
    countBy(
      [
        { a: 'toString', b: 'toString' },
        { a: 'toString', b: 'valueOf' },
        { a: 'valueOf', b: 'toString' },
        { a: 'toString', b: '__proto__' },
      ],
      prop('a'),
    ),
  ).toStrictEqual({ toString: 3, valueOf: 1 });
});

it('skip items', () => {
  expect(
    countBy([1, 2, 3, 4, 5], when(isStrictEqual(3), constant(undefined))),
  ).toStrictEqual({ 1: 1, 2: 1, 4: 1, 5: 1 });
});
