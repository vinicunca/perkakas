import { assertType, describe, expect, it } from 'vitest';

import { isNumber } from './is-number';
import { partition } from './partition';
import { pipe } from './pipe';

const array = [
  { a: 1, b: 1 },
  { a: 1, b: 2 },
  { a: 2, b: 1 },
  { a: 1, b: 3 },
] as const;
const expected = [
  [
    { a: 1, b: 1 },
    { a: 1, b: 2 },
    { a: 1, b: 3 },
  ],
  [{ a: 2, b: 1 }],
];

describe('data first', () => {
  it('partition', () => {
    expect(partition(array, (x) => x.a === 1)).toEqual(expected);
  });
  it('partition with type guard', () => {
    const actual = partition([1, 'a', 2, 'b'], isNumber);
    expect(actual).toEqual([
      [1, 2],
      ['a', 'b'],
    ]);
    assertType<[Array<number>, Array<string>]>(actual);
  });
  it('partition with type guard in pipe', () => {
    const actual = pipe(
      [1, 'a', 2, 'b'],
      partition((value): value is number => {
        return typeof value === 'number';
      }),
    );
    expect(actual).toEqual([
      [1, 2],
      ['a', 'b'],
    ]);
    assertType<[Array<number>, Array<string>]>(actual);
  });
  it('partition.indexed', () => {
    expect(partition.indexed(array, (_, index) => index !== 2)).toEqual(
      expected,
    );
  });
});

describe('data last', () => {
  it('partition', () => {
    expect(
      pipe(
        array,
        partition((x) => x.a === 1),
      ),
    ).toEqual(expected);
  });
  it('partition.indexed', () => {
    expect(
      pipe(
        array,
        partition.indexed((_, index) => index !== 2),
      ),
    ).toEqual(expected);
  });
});
