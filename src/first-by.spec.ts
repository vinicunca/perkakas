import { describe, expect, it, vi } from 'vitest';
import { firstBy } from './first-by';
import { identity } from './identity';
import { pipe } from './pipe';

describe('runtime (dataFirst)', () => {
  it('returns undefined on empty', () => {
    expect(firstBy([], identity())).toBeUndefined();
  });

  it('returns the item on a single item array', () => {
    expect(firstBy([1], identity())).toBe(1);
  });

  it('finds the minimum', () => {
    expect(firstBy([2, 1, 4, 3, 5], identity())).toBe(1);
  });

  it('finds the minimum with a non-trivial order rule', () => {
    expect(firstBy(['aa', 'a', 'aaaa', 'aaa', 'aaaaa'], (x) => x.length)).toBe(
      'a',
    );
  });

  it('finds the max with \'desc\' order rules', () => {
    expect(firstBy([2, 1, 4, 3, 5], [
      identity(),
      'desc',
    ])).toBe(5);
  });

  it('finds the max with non-trivial \'desc\' order rules', () => {
    expect(
      firstBy(['aa', 'a', 'aaaa', 'aaa', 'aaaaa'], [
        identity(),
        'desc',
      ]),
    ).toBe('aaaaa');
  });

  it('breaks ties with multiple order rules', () => {
    const data = [
      'a',
      'bb',
      'b',
      'aaaa',
      'bbb',
      'aa',
      'aaa',
      'bbbb',
    ];

    expect(firstBy(data, (x) => x.length, identity())).toBe('a');
    expect(firstBy(data, [
      (x) => x.length,
      'desc',
    ], identity())).toBe('aaaa');
    expect(firstBy(data, (x) => x.length, [
      identity(),
      'desc',
    ])).toBe('b');
    expect(firstBy(data, [
      (x) => x.length,
      'desc',
    ], [
      identity(),
      'desc',
    ])).toBe(
      'bbbb',
    );
  });

  it('can compare strings', () => {
    expect(firstBy(['b', 'a', 'c'], identity())).toBe('a');
  });

  it('can compare numbers', () => {
    expect(firstBy([2, 1, 3], identity())).toBe(1);
  });

  it('can compare booleans', () => {
    expect(firstBy([true, false, true, true, false], identity())).toBe(false);
  });

  it('can compare valueOfs', () => {
    expect(
      firstBy([
        new Date(),
        new Date(1),
        new Date(2),
      ], identity()),
    ).toStrictEqual(new Date(1));
  });

  it('doesn\'t project an empty array', () => {
    const projection = vi.fn<(value: number) => number>(identity());

    firstBy([], projection);

    expect(projection).not.toHaveBeenCalled();
  });

  it('doesn\'t project a single item', () => {
    const projection = vi.fn<(value: number) => number>(identity());

    firstBy([1], projection);

    expect(projection).not.toHaveBeenCalled();
  });

  it('projects each later item, then the current first', () => {
    const projection = vi.fn<(value: number) => number>(identity());

    firstBy([3, 1, 2], projection);

    expect(projection.mock.calls).toStrictEqual([
      [1],
      [3],
      [2],
      [1],
    ]);
  });

  it('keeps the earlier of tied items', () => {
    const earlier = { id: 0 };

    expect(firstBy([
      earlier,
      { id: 0 },
    ], ({ id }) => id)).toBe(earlier);
  });

  it('keeps -0 ahead of a tied 0', () => {
    expect(firstBy([-0, 0], identity())).toBe(-0);
  });

  it('a NaN projection ties with every item', () => {
    expect(firstBy([NaN, 1], identity())).toBeNaN();
  });
});

describe('runtime (dataLast)', () => {
  it('returns undefined on empty', () => {
    expect(pipe([], firstBy(identity()))).toBeUndefined();
  });

  it('returns the item on a single item array', () => {
    expect(pipe([1], firstBy(identity()))).toBe(1);
  });

  it('finds the minimum', () => {
    expect(pipe([2, 1, 4, 3, 5], firstBy(identity()))).toBe(1);
  });

  it('finds the minimum with a non-trivial order rule', () => {
    expect(
      pipe(
        ['aa', 'a', 'aaaa', 'aaa', 'aaaaa'],
        firstBy((x) => x.length),
      ),
    ).toBe('a');
  });

  it('finds the max with \'desc\' order rules', () => {
    expect(pipe([2, 1, 4, 3, 5], firstBy([
      identity(),
      'desc',
    ]))).toBe(5);
  });

  it('finds the max with non-trivial \'desc\' order rules', () => {
    expect(
      pipe(['aa', 'a', 'aaaa', 'aaa', 'aaaaa'], firstBy([
        identity(),
        'desc',
      ])),
    ).toBe('aaaaa');
  });

  it('breaks ties with multiple order rules', () => {
    const data = [
      'a',
      'bb',
      'b',
      'aaaa',
      'bbb',
      'aa',
      'aaa',
      'bbbb',
    ];

    expect(
      pipe(
        data,
        firstBy((x) => x.length, identity()),
      ),
    ).toBe('a');
    expect(pipe(data, firstBy([
      (x) => x.length,
      'desc',
    ], identity()))).toBe(
      'aaaa',
    );
    expect(
      pipe(
        data,
        firstBy((x) => x.length, [
          identity(),
          'desc',
        ]),
      ),
    ).toBe('b');
    expect(
      pipe(
        data,
        firstBy([
          (x: string) => x.length,
          'desc',
        ], [
          identity(),
          'desc',
        ]),
      ),
    ).toBe('bbbb');
  });

  it('can compare strings', () => {
    expect(pipe(['b', 'a', 'c'], firstBy(identity()))).toBe('a');
  });

  it('can compare numbers', () => {
    expect(pipe([2, 1, 3], firstBy(identity()))).toBe(1);
  });

  it('can compare booleans', () => {
    expect(pipe([true, false, true, true, false], firstBy(identity()))).toBe(
      false,
    );
  });

  it('can compare valueOfs', () => {
    expect(
      pipe([
        new Date(),
        new Date(1),
        new Date(2),
      ], firstBy(identity())),
    ).toStrictEqual(new Date(1));
  });
});
