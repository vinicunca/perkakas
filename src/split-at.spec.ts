import { describe, expect, it } from 'vitest';
import { pipe } from './pipe';
import { splitAt } from './split-at';

describe('data_first', () => {
  it('split', () => {
    expect(splitAt([1, 2, 3] as const, 1)).toStrictEqual([
      [1],
      [2, 3],
    ]);
  });

  it('split at -1', () => {
    expect(splitAt([1, 2, 3, 4, 5] as const, -1)).toStrictEqual([
      [1, 2, 3, 4],
      [5],
    ]);
  });

  it('empty array', () => {
    expect(splitAt([], 1)).toStrictEqual([[], []]);
  });

  it('single item', () => {
    expect(splitAt([1], 1)).toStrictEqual([
      [1],
      [],
    ]);
  });

  it('index 0', () => {
    expect(splitAt([1, 2, 3], 0)).toStrictEqual([
      [],
      [1, 2, 3],
    ]);
  });

  it('index -0', () => {
    expect(splitAt([1, 2, 3], -0)).toStrictEqual([
      [],
      [1, 2, 3],
    ]);
  });

  it('fractional index truncates', () => {
    expect(splitAt([1, 2, 3], 1.5)).toStrictEqual([
      [1],
      [2, 3],
    ]);
  });

  it('negative fractional index counts from the end before truncating', () => {
    expect(splitAt([1, 2, 3, 4, 5], -1.5)).toStrictEqual([
      [1, 2, 3],
      [4, 5],
    ]);
  });

  it('index NaN', () => {
    expect(splitAt([1, 2, 3], NaN)).toStrictEqual([
      [],
      [1, 2, 3],
    ]);
  });

  it('index at the length', () => {
    expect(splitAt([1, 2, 3], 3)).toStrictEqual([
      [1, 2, 3],
      [],
    ]);
  });

  it('index past the length is clamped', () => {
    expect(splitAt([1, 2, 3], 5)).toStrictEqual([
      [1, 2, 3],
      [],
    ]);
  });

  it('negative index past the length is clamped', () => {
    expect(splitAt([1, 2, 3], -5)).toStrictEqual([
      [],
      [1, 2, 3],
    ]);
  });

  it('index Infinity', () => {
    expect(splitAt([1, 2, 3], Infinity)).toStrictEqual([
      [1, 2, 3],
      [],
    ]);
  });

  it('index -Infinity', () => {
    expect(splitAt([1, 2, 3], -Infinity)).toStrictEqual([
      [],
      [1, 2, 3],
    ]);
  });

  it('holes are kept', () => {
    // eslint-disable-next-line no-sparse-arrays -- The holes are the input under test.
    expect(splitAt([1, , 3], 1)).toStrictEqual([
      [1],
      // eslint-disable-next-line no-sparse-arrays
      [, 3],
    ]);
  });
});

describe('data_last', () => {
  it('split', () => {
    expect(splitAt(1)([1, 2, 3] as const)).toStrictEqual([
      [1],
      [2, 3],
    ]);
  });

  it('split at -1', () => {
    expect(splitAt(-1)([1, 2, 3, 4, 5] as const)).toStrictEqual([
      [1, 2, 3, 4],
      [5],
    ]);
  });

  it('empty array', () => {
    expect(pipe([], splitAt(1))).toStrictEqual([[], []]);
  });

  it('holes are kept', () => {
    // eslint-disable-next-line no-sparse-arrays -- The holes are the input under test.
    expect(pipe([1, , 3], splitAt(1))).toStrictEqual([
      [1],
      // eslint-disable-next-line no-sparse-arrays
      [, 3],
    ]);
  });
});
