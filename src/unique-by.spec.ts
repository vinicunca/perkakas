import type { LazyCallback } from './internal/types/lazy-callback';
import { describe, expect, it, vi } from 'vitest';
import { createLazyInvocationCounter } from '../test/lazy-invocation-counter';
import { identity } from './identity';
import { pipe } from './pipe';
import { take } from './take';
import { uniqueBy } from './unique-by';

const PEOPLE = [
  { name: 'John', age: 42 },
  { name: 'Jörn', age: 30 },
  { name: 'Sarah', age: 33 },
  { name: 'Kim', age: 22 },
  { name: 'Sarah', age: 38 },
  { name: 'John', age: 33 },
  { name: 'Emily', age: 42 },
] as const;

it('handles uniq by identity', () => {
  expect(uniqueBy([1, 2, 2, 5, 1, 6, 7], identity())).toStrictEqual([
    1,
    2,
    5,
    6,
    7,
  ]);
});

it('returns people with uniq names', () => {
  expect(uniqueBy(PEOPLE, (p) => p.name)).toStrictEqual([
    { name: 'John', age: 42 },
    { name: 'Jörn', age: 30 },
    { name: 'Sarah', age: 33 },
    { name: 'Kim', age: 22 },
    { name: 'Emily', age: 42 },
  ]);
});

it('returns people with uniq ages', () => {
  expect(uniqueBy(PEOPLE, (p) => p.age)).toStrictEqual([
    { name: 'John', age: 42 },
    { name: 'Jörn', age: 30 },
    { name: 'Sarah', age: 33 },
    { name: 'Kim', age: 22 },
    { name: 'Sarah', age: 38 },
  ]);
});

it('returns people with uniq first letter of name', () => {
  expect(uniqueBy(PEOPLE, (p) => p.name.slice(0, 1))).toStrictEqual([
    { name: 'John', age: 42 },
    { name: 'Sarah', age: 33 },
    { name: 'Kim', age: 22 },
    { name: 'Emily', age: 42 },
  ]);
});

it('provides the items processed so far to the key function', () => {
  const mock = vi.fn<LazyCallback<Array<unknown>, unknown>>(
    (_item, _index, data) => [...data],
  );
  uniqueBy([1, 2, 2, 3], mock);

  expect(mock).toHaveNthReturnedWith(1, [1]);
  expect(mock).toHaveNthReturnedWith(2, [1, 2]);
  expect(mock).toHaveNthReturnedWith(3, [1, 2, 2]);
  expect(mock).toHaveNthReturnedWith(4, [1, 2, 2, 3]);
});

describe(pipe, () => {
  it('gets executed until target length is reached', () => {
    const counter = createLazyInvocationCounter();
    const result = pipe(
      [1, 2, 2, 5, 1, 6, 7],
      counter.fn(),
      uniqueBy(identity()),
      take(3),
    );

    expect(counter.count).toHaveBeenCalledTimes(4);
    expect(result).toStrictEqual([1, 2, 5]);
  });

  it('get executed 3 times when take before uniqueBy', () => {
    const counter = createLazyInvocationCounter();
    const result = pipe(
      [1, 2, 2, 5, 1, 6, 7],
      counter.fn(),
      take(3),
      uniqueBy(identity()),
    );

    expect(counter.count).toHaveBeenCalledTimes(3);
    expect(result).toStrictEqual([1, 2]);
  });
});
