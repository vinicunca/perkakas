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
    ).toEqual([
      [
        { a: 1, b: 1 },
        { a: 1, b: 2 },
        { a: 1, b: 3 },
      ],
      [{ a: 2, b: 1 }],
    ]);
  });

  it('partition with type guard', () => {
    expect(partition([1, 'a', 2, 'b'], isNumber)).toEqual([
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
    ).toEqual([
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
    ).toEqual([
      [
        { a: 1, b: 1 },
        { a: 1, b: 2 },
        { a: 1, b: 3 },
      ],
      [{ a: 2, b: 1 }],
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
    ).toEqual([
      [
        { a: 1, b: 1 },
        { a: 1, b: 2 },
        { a: 1, b: 3 },
      ],
      [{ a: 2, b: 1 }],
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
    ).toEqual([
      [
        { a: 1, b: 1 },
        { a: 1, b: 2 },
        { a: 1, b: 3 },
      ],
      [{ a: 2, b: 1 }],
    ]);
  });
});
