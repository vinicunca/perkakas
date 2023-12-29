import { describe, expect, it } from 'vitest';

import { createLazyInvocationCounter } from '../../test/lazy-invocation-counter';
import { pipe } from '../function';
import { equals } from '../object';
import { take } from './take';
import { uniqWith } from './uniq-with';

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
    expect(uniqWith(source, equals)).toEqual(expected);
  });
});

describe('data_last', () => {
  it('should return uniq', () => {
    expect(uniqWith(equals)(source)).toEqual(expected);
  });

  it('lazy', () => {
    const counter = createLazyInvocationCounter();
    const result = pipe(
      [{ a: 1 }, { a: 2 }, { a: 2 }, { a: 5 }, { a: 1 }, { a: 6 }, { a: 7 }],
      counter.fn(),
      uniqWith(equals),
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
      uniqWith(equals),
    );
    expect(counter.count).toHaveBeenCalledTimes(3);
    expect(result).toEqual([{ a: 1 }, { a: 2 }]);
  });
});
