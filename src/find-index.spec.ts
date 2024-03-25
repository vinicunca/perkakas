import { describe, expect, it } from 'vitest';

import { createLazyInvocationCounter } from '../../test/lazy-invocation-counter';
import { pipe } from '../pipe';
import { findIndex } from './find-index';

describe('data first', () => {
  it('findIndex', () => {
    expect(findIndex([10, 20, 30] as const, (x) => x === 20)).toBe(1);
  });

  it('findIndex.indexed', () => {
    expect(findIndex([10, 20, 30] as const, (x) => x === 20)).toBe(1);
  });

  it('findIndex -1', () => {
    expect(findIndex([2, 3, 4] as const, (x) => x === (20 as number))).toBe(-1);
  });
});

describe('data last', () => {
  it('findIndex', () => {
    const counter = createLazyInvocationCounter();
    const actual = pipe(
      [10, 20, 30] as const,
      counter.fn(),
      findIndex((x) => x === 20),
    );
    expect(counter.count).toHaveBeenCalledTimes(2);
    expect(actual).toEqual(1);
  });

  it('findIndex.indexed', () => {
    const counter = createLazyInvocationCounter();
    const actual = pipe(
      [10, 20, 30] as const,
      counter.fn(),
      findIndex.indexed((x) => x === 20),
    );
    expect(counter.count).toHaveBeenCalledTimes(2);
    expect(actual).toEqual(1);
  });
});
