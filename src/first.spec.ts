import { describe, expect, it } from 'vitest';
import { createLazyInvocationCounter } from '../test/lazy-invocation-counter';
import { filter } from './filter';
import { first } from './first';
import { pipe } from './pipe';

const assertIsDefined = <T>(v: T | null | undefined): T => v!;

it('should return first', () => {
  expect(first([1, 2, 3] as const)).toBe(1);
});

it('empty array', () => {
  expect(first([])).toBe(undefined);
});

describe('pipe', () => {
  it('as fn', () => {
    const counter = createLazyInvocationCounter();
    const result = pipe([1, 2, 3, 4, 5, 6] as const, counter.fn(), first());
    expect(counter.count).toHaveBeenCalledTimes(1);
    expect(result).toBe(1);
  });

  it('with filter', () => {
    const counter = createLazyInvocationCounter();
    const result = pipe(
      [1, 2, 4, 8, 16] as const,
      counter.fn(),
      filter((x) => x > 3),
      first(),
      assertIsDefined,
      (x) => x + 1,
    );
    expect(counter.count).toHaveBeenCalledTimes(3);
    expect(result).toBe(5);
  });

  it('empty array', () => {
    const counter = createLazyInvocationCounter();
    const result = pipe([] as const, counter.fn(), first());
    expect(counter.count).toHaveBeenCalledTimes(0);
    expect(result).toBe(undefined);
  });

  it('2 x first()', () => {
    const counter = createLazyInvocationCounter();
    const result = pipe(
      [[1, 2, 3], [4, 5], [6]] as const,
      counter.fn(),
      first(),
      assertIsDefined,
      first(),
    );
    expect(counter.count).toHaveBeenCalledTimes(1);
    expect(result).toBe(1);
  });

  it('complex', () => {
    const counter1 = createLazyInvocationCounter();
    const counter2 = createLazyInvocationCounter();
    const result = pipe(
      [[1, 2, 3], [1], [4, 5, 6, 7], [1, 2, 3, 4]] as const,
      counter1.fn(),
      filter((arr) => arr.length === 4),
      first(),
      assertIsDefined<ReadonlyArray<number>>,
      counter2.fn(),
      filter((x) => x % 2 === 1),
      first(),
    );
    expect(counter1.count).toHaveBeenCalledTimes(3);
    expect(counter2.count).toHaveBeenCalledTimes(2);
    expect(result).toBe(5);
  });
});

it('simple empty array', () => {
  const arr: Array<number> = [];
  const result = first(arr);
  expect(result).toBe(undefined);
});

it('simple array', () => {
  const arr: Array<number> = [1];
  const result = first(arr);
  expect(result).toBe(1);
});

it('simple non-empty array', () => {
  const arr: [number, ...Array<number>] = [1];
  const result = first(arr);
  expect(result).toBe(1);
});

it('simple tuple', () => {
  const arr: [number, string] = [1, 'a'];
  const result = first(arr);
  expect(result).toBe(1);
});

it('array with more than one item', () => {
  const arr: [number, number, ...Array<number>] = [1, 2];
  const result = first(arr);
  expect(result).toBe(1);
});

it('trivial empty array', () => {
  const arr: [] = [];
  const result = first(arr);
  expect(result).toBe(undefined);
});

it('array with last', () => {
  const arr: [...Array<number>, number] = [1];
  const result = first(arr);
  expect(result).toBe(1);
});

it('tuple with last', () => {
  const arr: [...Array<string>, number] = ['a', 1];
  const result = first(arr);
  expect(result).toBe('a');
});

it('simple empty readonly array', () => {
  const arr: ReadonlyArray<number> = [];
  const result = first(arr);
  expect(result).toBe(undefined);
});

it('simple readonly array', () => {
  const arr: ReadonlyArray<number> = [1];
  const result = first(arr);
  expect(result).toBe(1);
});

it('simple non-empty readonly array', () => {
  const arr: readonly [number, ...Array<number>] = [1];
  const result = first(arr);
  expect(result).toBe(1);
});

it('simple readonly tuple', () => {
  const arr: readonly [number, string] = [1, 'a'];
  const result = first(arr);
  expect(result).toBe(1);
});

it('readonly array with more than one item', () => {
  const arr: readonly [number, number, ...Array<number>] = [1, 2];
  const result = first(arr);
  expect(result).toBe(1);
});

it('readonly trivial empty array', () => {
  const arr: readonly [] = [];
  const result = first(arr);
  expect(result).toBe(undefined);
});

it('readonly array with last', () => {
  const arr: readonly [...Array<number>, number] = [1];
  const result = first(arr);
  expect(result).toBe(1);
});

it('readonly tuple with last', () => {
  const arr: readonly [...Array<string>, number] = ['a', 1];
  const result = first(arr);
  expect(result).toBe('a');
});
