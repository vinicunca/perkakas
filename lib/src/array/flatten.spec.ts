import { describe, expect, it } from 'vitest';

import { createLazyInvocationCounter } from '../../test/lazy-invocation-counter';
import { pipe } from '../function';
import { find } from './find';
import { flatten } from './flatten';

it('flatten', () => {
  expect(flatten([[1, 2], 3, [4, 5]] as const)).toEqual([1, 2, 3, 4, 5]);
});

it('nested', () => {
  expect(
    flatten([
      [1, 2],
      [[3], [4, 5]],
    ] as const),
  ).toEqual([1, 2, [3], [4, 5]]);
});

describe('pipe', () => {
  it('flatten multiple values', () => {
    const result = pipe([[1, 2], 3, [4, 5]] as const, flatten());
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it('flatten single value', () => {
    const result = pipe([[1]] as const, flatten());
    expect(result).toEqual([1]);
  });

  it('with find', () => {
    const counter1 = createLazyInvocationCounter();
    const counter2 = createLazyInvocationCounter();
    const result = pipe(
      [[1, 2], 3, [4, 5]] as const,
      counter1.fn(),
      flatten(),
      counter2.fn(),
      find((x) => x - 1 === 2),
    );
    expect(counter1.count).toHaveBeenCalledTimes(2);
    expect(counter2.count).toHaveBeenCalledTimes(3);
    expect(result).toEqual(3);
  });
});
