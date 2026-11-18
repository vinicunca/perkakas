import { describe, expect, it } from 'vitest';
import { constant } from './constant';
import { isNullish } from './is-nullish';
import { map } from './map';
import { pipe } from './pipe';
import { prop } from './prop';
import { sortBy } from './sort-by';
import { when } from './when';

const DATA = [
  {
    id: 1,
    color: 'red',
    weight: 2,
    active: true,
    date: new Date(2021, 1, 1),
  },
  {
    id: 2,
    color: 'blue',
    weight: 3,
    active: false,
    date: new Date(2021, 1, 2),
  },
  {
    id: 3,
    color: 'green',
    weight: 1,
    active: false,
    date: new Date(2021, 1, 3),
  },
  {
    id: 4,
    color: 'purple',
    weight: 1,
    active: true,
    date: new Date(2021, 1, 4),
  },
];

describe('data first', () => {
  it('sort correctly', () => {
    expect(
      sortBy([
        { a: 1 },
        { a: 3 },
        { a: 7 },
        { a: 2 },
      ], prop('a')),
    ).toStrictEqual([
      { a: 1 },
      { a: 2 },
      { a: 3 },
      { a: 7 },
    ]);
  });

  it('sort booleans correctly', () => {
    expect(
      sortBy(DATA, [
        prop('active'),
        'desc',
      ]).map(prop('active')),
    ).toStrictEqual([true, true, false, false]);
  });

  it('sort dates correctly', () => {
    expect(sortBy(DATA, [
      prop('date'),
      'desc',
    ]).map(prop('id'))).toStrictEqual([
      4,
      3,
      2,
      1,
    ]);
  });

  it('sort objects correctly', () => {
    expect(
      sortBy(DATA, prop('active'), prop('weight')).map(prop('color')),
    ).toStrictEqual(['green', 'blue', 'purple', 'red']);
  });

  it('sort objects correctly mixing sort pair and sort projection', () => {
    expect(
      sortBy(DATA, prop('weight'), [
        prop('color'),
        'desc',
      ]).map(prop('color')),
    ).toStrictEqual(['purple', 'green', 'red', 'blue']);
  });

  it('breaks ties with a third rule', () => {
    expect(
      sortBy(
        [
          { a: 1, b: 1, c: 1 },
          { a: 1, b: 1, c: 2 },
          { a: 0, b: 5, c: 0 },
        ],
        prop('a'),
        prop('b'),
        [
          prop('c'),
          'desc',
        ],
      ).map(prop('c')),
    ).toStrictEqual([0, 2, 1]);
  });

  it('equal dates fall through to the next rule', () => {
    expect(
      sortBy(
        [
          {
            date: new Date(1),
            id: 2,
          },
          {
            date: new Date(1),
            id: 1,
          },
          {
            date: new Date(1),
            id: 3,
          },
        ],
        prop('date'),
        prop('id'),
      ).map(prop('id')),
    ).toStrictEqual([1, 2, 3]);
  });

  it('an array of functions is data', () => {
    const foo = (x: number): number => x;
    const bar = (x: number): number => x;

    expect(sortBy([foo, bar], (fn) => fn.name)).toStrictEqual([bar, foo]);
  });

  it('sort objects descending correctly', () => {
    expect(
      sortBy(DATA, [
        prop('weight'),
        'desc',
      ]).map(prop('weight')),
    ).toStrictEqual([3, 2, 1, 1]);
  });
});

describe('data last', () => {
  it('sort correctly', () => {
    expect(
      pipe([
        { a: 1 },
        { a: 3 },
        { a: 7 },
        { a: 2 },
      ], sortBy(prop('a'))),
    ).toStrictEqual([
      { a: 1 },
      { a: 2 },
      { a: 3 },
      { a: 7 },
    ]);
  });

  it('sort correctly using pipe and "desc"', () => {
    expect(
      pipe(
        [
          { a: 1 },
          { a: 3 },
          { a: 7 },
          { a: 2 },
        ],
        sortBy([
          prop('a'),
          'desc',
        ]),
      ),
    ).toStrictEqual([
      { a: 7 },
      { a: 3 },
      { a: 2 },
      { a: 1 },
    ]);
  });

  it('sort objects correctly', () => {
    expect(
      pipe(DATA, sortBy(prop('active'), prop('weight')), map(prop('color'))),
    ).toStrictEqual(['green', 'blue', 'purple', 'red']);
  });

  it('breaks ties with a third rule', () => {
    expect(
      pipe(
        [
          { a: 1, b: 1, c: 1 },
          { a: 1, b: 1, c: 2 },
          { a: 0, b: 5, c: 0 },
        ],
        sortBy(prop('a'), prop('b'), [
          prop('c'),
          'desc',
        ]),
        map(prop('c')),
      ),
    ).toStrictEqual([0, 2, 1]);
  });

  it('sort objects correctly by weight asc then color desc', () => {
    expect(
      pipe(
        DATA,
        sortBy([
          prop('weight'),
          'asc',
        ], [
          prop('color'),
          'desc',
        ]),
        map(prop('color')),
      ),
    ).toStrictEqual(['purple', 'green', 'red', 'blue']);
  });

  it('a projection with a `length` of 0', () => {
    expect(
      pipe([3, null, 1, 2], sortBy(when(isNullish, constant(Infinity)))),
    ).toStrictEqual([1, 2, 3, null]);
  });
});
