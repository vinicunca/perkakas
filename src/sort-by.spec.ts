import { describe, expect, expectTypeOf, it } from 'vitest';

import { identity } from './identity';
import { pipe } from './pipe';
import { sortBy } from './sort-by';

const items = [{ a: 1 }, { a: 3 }, { a: 7 }, { a: 2 }] as const;
const sorted = [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 7 }];

function assertType<T>(data: T): T {
  return data;
}

const objects = [
  { active: true, color: 'red', date: new Date(2021, 1, 1), id: 1, weight: 2 },
  {
    active: false,
    color: 'blue',
    date: new Date(2021, 1, 2),
    id: 2,
    weight: 3,
  },
  {
    active: false,
    color: 'green',
    date: new Date(2021, 1, 3),
    id: 3,
    weight: 1,
  },
  {
    active: true,
    color: 'purple',
    date: new Date(2021, 1, 4),
    id: 4,
    weight: 1,
  },
];

describe('data first', () => {
  it('sort correctly', () => {
    expect(sortBy(items, (x) => x.a)).toEqual(sorted);
  });
  it('sort booleans correctly', () => {
    expect(sortBy(objects, [(x) => x.active, 'desc']).map((x) => x.active)).toEqual(
      [true, true, false, false],
    );
  });
  it('sort dates correctly', () => {
    expect(sortBy(objects, [(x) => x.date, 'desc']).map((x) => x.id)).toEqual([
      4,
      3,
      2,
      1,
    ]);
  });
  it('sort objects correctly', () => {
    expect(
      sortBy(
        objects,
        (x) => x.weight,
        (x) => x.color,
      ).map((x) => x.weight),
    ).toEqual([1, 1, 2, 3]);
  });
  it('sort objects correctly mixing sort pair and sort projection', () => {
    expect(
      sortBy(objects, (x) => x.weight, [(x) => x.color, 'asc']).map((x) => x.weight),
    ).toEqual([1, 1, 2, 3]);
  });
  it('sort objects descending correctly', () => {
    expect(sortBy(objects, [(x) => x.weight, 'desc']).map((x) => x.weight)).toEqual(
      [3, 2, 1, 1],
    );
  });

  describe('sortBy typings', () => {
    it('sortProjection', () => {
      const actual = sortBy(items, (x) => x.a);
      type T = (typeof items)[number];
      assertType<Array<T>>(actual);
    });
    it('sortPair', () => {
      const actual = sortBy(objects, [(x) => x.active, 'desc']);
      type T = (typeof objects)[number];
      assertType<Array<T>>(actual);
    });
  });
});

describe('data last', () => {
  it('sort correctly', () => {
    expect(
      pipe(
        items,
        sortBy((x) => x.a),
      ),
    ).toEqual(sorted);
  });
  it('sort correctly using pipe and "desc"', () => {
    expect(pipe(items, sortBy([(x) => x.a, 'desc']))).toEqual(
      [...sorted].reverse(),
    );
  });
  it('sort objects correctly', () => {
    const sortFn = sortBy<{ color: string; weight: number }>(
      (x) => x.weight,
      (x) => x.color,
    );
    expect(sortFn(objects).map((x) => x.color)).toEqual([
      'green',
      'purple',
      'red',
      'blue',
    ]);
  });
  it('sort objects correctly by weight asc then color desc', () => {
    expect(
      sortBy<{ color: string; weight: number }>(
        [(x) => x.weight, 'asc'],
        [(x) => x.color, 'desc'],
      )(objects).map((x) => x.color),
    ).toEqual(['purple', 'green', 'red', 'blue']);
  });

  describe('sortBy typings', () => {
    it('sortProjection', () => {
      const actual = pipe(
        items,
        sortBy((x) => x.a),
      );
      type T = (typeof items)[number];
      assertType<Array<T>>(actual);
    });
    it('sortPair', () => {
      const actual = pipe(
        objects,
        sortBy([(x) => x.weight, 'asc'], [(x) => x.color, 'desc']),
      );
      type T = (typeof objects)[number];
      assertType<Array<T>>(actual);
    });
  });
});

describe('strict', () => {
  it('on empty tuple', () => {
    const array: [] = [];
    const result = sortBy.strict(array, identity);
    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  it('on empty readonly tuple', () => {
    const array: readonly [] = [];
    const result = sortBy.strict(array, identity);
    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  it('on array', () => {
    const array: Array<number> = [];
    const result = sortBy.strict(array, identity);
    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  it('on readonly array', () => {
    const array: ReadonlyArray<number> = [];
    const result = sortBy.strict(array, identity);
    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  it('on tuple', () => {
    const array: [1, 2, 3] = [1, 2, 3];
    const result = sortBy.strict(array, identity);
    expectTypeOf(result).toEqualTypeOf<[1 | 2 | 3, 1 | 2 | 3, 1 | 2 | 3]>();
  });

  it('on readonly tuple', () => {
    const array: readonly [1, 2, 3] = [1, 2, 3];
    const result = sortBy.strict(array, identity);
    expectTypeOf(result).toEqualTypeOf<[1 | 2 | 3, 1 | 2 | 3, 1 | 2 | 3]>();
  });

  it('on tuple with rest tail', () => {
    const array: [number, ...Array<number>] = [1];
    const result = sortBy.strict(array, identity);
    expectTypeOf(result).toEqualTypeOf<[number, ...Array<number>]>();
  });

  it('on readonly tuple with rest tail', () => {
    const array: readonly [number, ...Array<number>] = [1];
    const result = sortBy.strict(array, identity);
    expectTypeOf(result).toEqualTypeOf<[number, ...Array<number>]>();
  });

  it('on tuple with rest middle', () => {
    const array: [number, ...Array<number>, number] = [3, 2, 1];
    const result = sortBy.strict(array, identity);
    expectTypeOf(result).toEqualTypeOf<[number, ...Array<number>, number]>();
  });

  it('on readonly tuple with rest middle', () => {
    const array: readonly [number, ...Array<number>, number] = [3, 2, 1];
    const result = sortBy.strict(array, identity);
    expectTypeOf(result).toEqualTypeOf<[number, ...Array<number>, number]>();
  });

  it('on tuple with rest head', () => {
    const array: [...Array<number>, number] = [1];
    const result = sortBy.strict(array, identity);
    expectTypeOf(result).toEqualTypeOf<[...Array<number>, number]>();
  });

  it('on readonly tuple with rest head', () => {
    const array: readonly [...Array<number>, number] = [1];
    const result = sortBy.strict(array, identity);
    expectTypeOf(result).toEqualTypeOf<[...Array<number>, number]>();
  });

  it('on tuple with optional values', () => {
    const array: [number?, number?, number?] = [];
    const result = sortBy.strict(array, () => 0);
    expectTypeOf(result).toEqualTypeOf<[number?, number?, number?]>();
  });

  it('on readonly tuple with optional values', () => {
    const array: readonly [number?, number?, number?] = [];
    const result = sortBy.strict(array, () => 0);
    expectTypeOf(result).toEqualTypeOf<[number?, number?, number?]>();
  });

  it('on mixed types tuple', () => {
    const array: [number, string, boolean] = [1, 'hello', true];
    const result = sortBy.strict(array, identity);
    expectTypeOf(result).toEqualTypeOf<
    [
      boolean | number | string,
      boolean | number | string,
      boolean | number | string,
    ]
    >();
  });
});
