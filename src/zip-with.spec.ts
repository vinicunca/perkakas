import { describe, expect, it, vi } from 'vitest';
import { pipe } from './pipe';
import { zipWith } from './zip-with';

describe('data first', () => {
  it('should zip with predicate', () => {
    expect(
      zipWith(['1', '2', '3'], ['a', 'b', 'c'], (a, b) => `${a}${b}`),
    ).toStrictEqual(['1a', '2b', '3c']);
  });

  it('should truncate to shorter second', () => {
    expect(
      zipWith(['1', '2', '3'], ['a', 'b'], (a, b) => `${a}${b}`),
    ).toStrictEqual(['1a', '2b']);
  });

  it('should truncate to shorter first', () => {
    expect(
      zipWith(['1', '2'], ['a', 'b', 'c'], (a, b) => `${a}${b}`),
    ).toStrictEqual(['1a', '2b']);
  });
});

describe('data second', () => {
  it('should zip with predicate', () => {
    expect(
      zipWith((a: string, b: string) => `${a}${b}`)(
        ['1', '2', '3'],
        ['a', 'b', 'c'],
      ),
    ).toStrictEqual(['1a', '2b', '3c']);
  });

  it('should truncate to shorter second', () => {
    expect(
      zipWith((a: string, b: string) => `${a}${b}`)(
        ['1', '2', '3'],
        ['a', 'b'],
      ),
    ).toStrictEqual(['1a', '2b']);
  });

  it('should truncate to shorter first', () => {
    expect(
      zipWith((a: string, b: string) => `${a}${b}`)(
        ['1', '2'],
        ['a', 'b', 'c'],
      ),
    ).toStrictEqual(['1a', '2b']);
  });
});

describe('data second with initial arg', () => {
  it('should zip with predicate', () => {
    expect(
      pipe(
        ['1', '2', '3'],
        zipWith(['a', 'b', 'c'], (a, b) => `${a}${b}`),
      ),
    ).toStrictEqual(['1a', '2b', '3c']);
  });

  it('should truncate to shorter second', () => {
    expect(
      pipe(
        ['1', '2', '3'],
        zipWith(['a', 'b'], (a, b) => `${a}${b}`),
      ),
    ).toStrictEqual(['1a', '2b']);
  });

  it('should truncate to shorter first', () => {
    expect(
      pipe(
        ['1', '2'],
        zipWith(['a', 'b', 'c'], (a, b) => `${a}${b}`),
      ),
    ).toStrictEqual(['1a', '2b']);
  });

  it('should return empty when second is empty', () => {
    const mockFn = vi.fn<(a: string, b: string) => string>();

    expect(pipe(['1', '2'], zipWith([], mockFn))).toStrictEqual([]);
    expect(mockFn).toHaveBeenCalledTimes(0);
  });

  it('provides the first items processed so far', () => {
    const other = ['a', 'b', 'c'];
    const mock = vi.fn<
      (
        first: unknown,
        second: unknown,
        index: unknown,
        data: readonly [ReadonlyArray<unknown>, ReadonlyArray<unknown>],
      ) => unknown
    >((_first, _second, _index, data) => structuredClone(data),
    );
    pipe([1, 2, 3], zipWith(other, mock));

    expect(mock).toHaveNthReturnedWith(1, [[1], other]);
    expect(mock).toHaveNthReturnedWith(2, [[1, 2], other]);
    expect(mock).toHaveNthReturnedWith(3, [[1, 2, 3], other]);
  });

  it('should return empty when first is empty', () => {
    expect(
      pipe(
        [],
        zipWith(['a', 'b'], (a, b) => `${a}${b}`),
      ),
    ).toStrictEqual([]);
  });
});
