import { describe, expect, it } from 'vitest';
import { concat } from './concat';
import { filter } from './filter';
import { pipe } from './pipe';
import { take } from './take';

describe('data first', () => {
  it('concat', () => {
    const actual = concat([1, 2, 3] as const, ['a'] as const);

    expect(actual).toStrictEqual([1, 2, 3, 'a'] as const);
  });

  it('empty array', () => {
    expect(concat([], [1, 2])).toStrictEqual([1, 2]);
  });

  it('empty other', () => {
    expect(concat([1, 2], [])).toStrictEqual([1, 2]);
  });

  it('both empty', () => {
    expect(concat([], [])).toStrictEqual([]);
  });

  it('returns a new array even when other is empty', () => {
    const data = [1, 2];

    expect(concat(data, [])).not.toBe(data);
  });

  it('keeps NaN and -0', () => {
    expect(concat([NaN], [-0])).toStrictEqual([NaN, -0]);
  });

  it('other can be any iterable at runtime', () => {
    expect(
      // @ts-expect-error [ts2345] -- `other` is typed as an array, but it is only ever spread, so any iterable works at runtime.
      concat([1], new Set([2, 3])),
    ).toStrictEqual([1, 2, 3]);
  });
});

describe('data last', () => {
  it('concat', () => {
    const actual = pipe([1, 2, 3] as const, concat(['a'] as const));

    expect(actual).toStrictEqual([1, 2, 3, 'a']);
  });

  it('empty array', () => {
    expect(pipe([], concat([1, 2]))).toStrictEqual([1, 2]);
  });

  it('empty other', () => {
    expect(pipe([1, 2], concat([]))).toStrictEqual([1, 2]);
  });

  it('both empty', () => {
    expect(pipe([], concat([]))).toStrictEqual([]);
  });

  it('returns a new array even when other is empty', () => {
    const data = [1, 2];

    expect(pipe(data, concat([]))).not.toBe(data);
  });

  it('other can be any iterable at runtime', () => {
    expect(
      pipe(
        [1],
        // @ts-expect-error [ts2345] -- `other` is typed as an array, but it is only ever spread, so any iterable works at runtime.
        concat(new Set([2, 3])),
      ),
    ).toStrictEqual([1, 2, 3]);
  });

  it('appends after the items that reach it', () => {
    expect(
      pipe(
        [1, 2, 3],
        filter((x) => x % 2 === 1),
        concat([4]),
      ),
    ).toStrictEqual([1, 3, 4]);
  });

  it('before a stopper that ends inside other', () => {
    expect(pipe([1, 2], concat([3, 4]), take(3))).toStrictEqual([1, 2, 3]);
  });
});
