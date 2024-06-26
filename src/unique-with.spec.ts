import { createLazyInvocationCounter } from '../test/lazy-invocation-counter';
import { isDeepEqual } from './is-deep-equal';
import { pipe } from './pipe';
import { take } from './take';
import { uniqueWith } from './unique-with';

const source = [
  { a: 1 },
  { a: 2 },
  { a: 2 },
  { a: 5 },
  { a: 1 },
  { a: 6 },
  { a: 7 },
];
const expected = [{ a: 1 }, { a: 2 }, { a: 5 }, { a: 6 }, { a: 7 }];

describe('data_first', () => {
  it('should return uniq', () => {
    expect(uniqueWith(source, isDeepEqual)).toEqual(expected);
  });
});

describe('data_last', () => {
  it('should return uniq', () => {
    expect(uniqueWith(isDeepEqual)(source)).toEqual(expected);
  });

  it('lazy', () => {
    const counter = createLazyInvocationCounter();
    const result = pipe(
      [{ a: 1 }, { a: 2 }, { a: 2 }, { a: 5 }, { a: 1 }, { a: 6 }, { a: 7 }],
      counter.fn(),
      uniqueWith(isDeepEqual),
      take(3),
    );
    expect(counter.count).toHaveBeenCalledTimes(4);
    expect(result).toEqual([{ a: 1 }, { a: 2 }, { a: 5 }]);
  });

  it('take before uniq', () => {
    const counter = createLazyInvocationCounter();
    const result = pipe(
      [{ a: 1 }, { a: 2 }, { a: 2 }, { a: 5 }, { a: 1 }, { a: 6 }, { a: 7 }],
      counter.fn(),
      take(3),
      uniqueWith(isDeepEqual),
    );
    expect(counter.count).toHaveBeenCalledTimes(3);
    expect(result).toEqual([{ a: 1 }, { a: 2 }]);
  });
});
