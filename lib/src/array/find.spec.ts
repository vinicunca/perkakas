import { describe, expect, it } from 'vitest';

import { createLazyInvocationCounter } from '../../test/lazy-invocation-counter';
import { pipe } from '../function';
import { find } from './find';

const array = [
  { a: 1, b: 1 },
  { a: 1, b: 2 },
  { a: 2, b: 1 },
  { a: 1, b: 3 },
] as const;
const expected = { a: 1, b: 2 };

describe('data first', () => {
  it('find', () => {
    expect(find(array, (x) => x.b === 2)).toEqual(expected);
  });
  it('find.indexed', () => {
    expect(find.indexed(array, (x, idx) => x.b === 2 && idx === 1)).toEqual(
      expected,
    );
  });
});

describe('data last', () => {
  it('find', () => {
    const counter = createLazyInvocationCounter();
    const actual = pipe(
      array,
      counter.fn(),
      find((x) => x.b === 2),
    );
    expect(counter.count).toHaveBeenCalledTimes(2);
    expect(actual).toEqual(expected);
  });

  it('find.indexed', () => {
    const counter = createLazyInvocationCounter();
    const actual = pipe(
      array,
      counter.fn(),
      find.indexed((x, idx) => x.b === 2 && idx === 1),
    );
    expect(counter.count).toHaveBeenCalledTimes(2);
    expect(actual).toEqual(expected);
  });
});
