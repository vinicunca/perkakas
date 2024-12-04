import { createLazyInvocationCounter } from '../test/lazy-invocation-counter';
import { differenceWith } from './difference-with';
import { isDeepEqual } from './is-deep-equal';
import { pipe } from './pipe';
import { take } from './take';

const source = [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }];
const other = [{ a: 2 }, { a: 5 }, { a: 3 }];
const expected = [{ a: 1 }, { a: 4 }];

describe('data_first', () => {
  it('should return difference', () => {
    expect(differenceWith(source, other, isDeepEqual)).toStrictEqual(expected);
  });

  it('should allow differencing different data types', () => {
    expect(
      differenceWith([1, 2, 3, 4], ['2', '3'], (a, b) => a.toString() === b),
    ).toStrictEqual([1, 4]);
  });
});

describe('data_last', () => {
  it('should return difference', () => {
    expect(differenceWith(other, isDeepEqual)(source)).toStrictEqual(expected);
  });

  it('should allow differencing different data types', () => {
    expect(
      pipe(
        [1, 2, 3, 4],
        differenceWith(['2', '3'], (a, b) => a.toString() === b),
      ),
    ).toStrictEqual([1, 4]);
  });

  it('lazy', () => {
    const counter = createLazyInvocationCounter();
    const result = pipe(
      [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }, { a: 6 }],
      counter.fn(),
      differenceWith([{ a: 2 }, { a: 3 }], isDeepEqual),
      take(2),
    );
    expect(counter.count).toHaveBeenCalledTimes(4);
    expect(result).toStrictEqual([{ a: 1 }, { a: 4 }]);
  });
});
