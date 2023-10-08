import { describe, expect, it } from 'vitest';
import { createLazyInvocationCounter } from '../../test/lazy-invocation-counter';
import { equals } from '../object';
import { pipe } from '../function';
import { differenceWith } from './difference-with';
import { take } from './take';

const source = [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }];
const other = [{ a: 2 }, { a: 5 }, { a: 3 }];
const expected = [{ a: 1 }, { a: 4 }];

describe('data_first', () => {
  it('should return difference', () => {
    expect(differenceWith(source, other, equals)).toEqual(expected);
  });

  it('should allow differencing different data types', () => {
    expect(
      differenceWith([1, 2, 3, 4], ['2', '3'], (a, b) => a.toString() === b),
    ).toEqual([1, 4]);
  });
});

describe('data_last', () => {
  it('should return difference', () => {
    expect(differenceWith(other, equals)(source)).toEqual(expected);
  });

  it('should allow differencing different data types', () => {
    expect(
      pipe(
        [1, 2, 3, 4],
        differenceWith(['2', '3'], (a, b) => a.toString() === b),
      ),
    ).toEqual([1, 4]);
  });

  it('lazy', () => {
    const counter = createLazyInvocationCounter();
    const result = pipe(
      [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }, { a: 6 }],
      counter.fn(),
      differenceWith([{ a: 2 }, { a: 3 }], equals),
      take(2),
    );
    expect(counter.count).toHaveBeenCalledTimes(4);
    expect(result).toEqual([{ a: 1 }, { a: 4 }]);
  });
});
