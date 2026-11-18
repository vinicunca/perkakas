import { describe, expect, it, vi } from 'vitest';
import { constant } from './constant';
import { isNumber } from './is-number';
import { partition } from './partition';
import { pipe } from './pipe';

describe('data first', () => {
  it('partition', () => {
    expect(
      partition(
        [
          { a: 1, b: 1 },
          { a: 1, b: 2 },
          { a: 2, b: 1 },
          { a: 1, b: 3 },
        ],
        ({ a }) => a === 1,
      ),
    ).toStrictEqual([
      [
        { a: 1, b: 1 },
        { a: 1, b: 2 },
        { a: 1, b: 3 },
      ],
      [
        { a: 2, b: 1 },
      ],
    ]);
  });

  it('partition with type guard', () => {
    expect(partition([1, 'a', 2, 'b'], isNumber)).toStrictEqual([
      [1, 2],
      ['a', 'b'],
    ]);
  });

  it('partition with type guard in pipe', () => {
    expect(
      pipe(
        [1, 'a', 2, 'b'],
        partition((value): value is number => typeof value === 'number'),
      ),
    ).toStrictEqual([
      [1, 2],
      ['a', 'b'],
    ]);
  });

  it('indexed', () => {
    expect(
      partition(
        [
          { a: 1, b: 1 },
          { a: 1, b: 2 },
          { a: 2, b: 1 },
          { a: 1, b: 3 },
        ],
        (_, index) => index !== 2,
      ),
    ).toStrictEqual([
      [
        { a: 1, b: 1 },
        { a: 1, b: 2 },
        { a: 1, b: 3 },
      ],
      [
        { a: 2, b: 1 },
      ],
    ]);
  });

  it('empty array', () => {
    expect(partition([], constant(true))).toStrictEqual([[], []]);
  });

  it('single item', () => {
    expect(partition(['a'], constant(true))).toStrictEqual([
      ['a'],
      [],
    ]);
  });

  it('calls the predicate once per item, in order, with the whole input', () => {
    const data = ['a', 'b', 'c'];
    const predicate = vi.fn<
      (value: string, index: number, data: ReadonlyArray<string>) => boolean
    >(constant(true));

    partition(data, predicate);

    expect(predicate.mock.calls).toStrictEqual([
      ['a', 0, data],
      ['b', 1, data],
      ['c', 2, data],
    ]);
  });
});

describe('data last', () => {
  it('partition', () => {
    expect(
      pipe(
        [
          { a: 1, b: 1 },
          { a: 1, b: 2 },
          { a: 2, b: 1 },
          { a: 1, b: 3 },
        ],
        partition(({ a }) => a === 1),
      ),
    ).toStrictEqual([
      [
        { a: 1, b: 1 },
        { a: 1, b: 2 },
        { a: 1, b: 3 },
      ],
      [
        { a: 2, b: 1 },
      ],
    ]);
  });

  it('indexed', () => {
    expect(
      pipe(
        [
          { a: 1, b: 1 },
          { a: 1, b: 2 },
          { a: 2, b: 1 },
          { a: 1, b: 3 },
        ],
        partition((_, index) => index !== 2),
      ),
    ).toStrictEqual([
      [
        { a: 1, b: 1 },
        { a: 1, b: 2 },
        { a: 1, b: 3 },
      ],
      [
        { a: 2, b: 1 },
      ],
    ]);
  });

  it('empty array', () => {
    expect(pipe([], partition(constant(true)))).toStrictEqual([[], []]);
  });
});
