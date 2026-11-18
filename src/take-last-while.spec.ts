import { describe, expect, it, vi } from 'vitest';
import { constant } from './constant';
import { pipe } from './pipe';
import { take } from './take';
import { takeLastWhile } from './take-last-while';

describe('data first', () => {
  it('should return items after the last predicate failure', () => {
    expect(takeLastWhile([1, 2, 3, 4], (n) => n !== 2)).toStrictEqual([3, 4]);
  });

  it('should return an empty array when the last item fails the predicate', () => {
    expect(takeLastWhile([1, 2, 3, 4], (n) => n !== 4)).toStrictEqual([]);
  });

  it('should return rest of the items when first item fails the predicate', () => {
    expect(takeLastWhile([1, 2, 3, 4], (n) => n !== 1)).toStrictEqual([
      2,
      3,
      4,
    ]);
  });

  it('should return an empty array when an empty array is passed', () => {
    expect(takeLastWhile([], (n) => n > 0)).toStrictEqual([]);
  });

  it('should return a copy of the original array when all items pass the predicate', () => {
    const data = [1, 2, 3, 4];
    const result = takeLastWhile(data, (n) => n > 0);

    expect(result).toStrictEqual(data);
    expect(result).not.toBe(data);
  });

  it('doesn\'t call the predicate on an empty array', () => {
    const predicate = vi.fn<(value: number) => boolean>();

    takeLastWhile([], predicate);

    expect(predicate).not.toHaveBeenCalled();
  });

  it('a single passing item', () => {
    expect(takeLastWhile([5], constant(true))).toStrictEqual([5]);
  });

  it('a single failing item', () => {
    expect(takeLastWhile([5], constant(false))).toStrictEqual([]);
  });

  it('scans backward and stops at the first failure', () => {
    const data = [1, 2, 3, 4];
    const predicate = vi.fn<
      (value: number, index: number, data: ReadonlyArray<number>) => boolean
    >((value) => value !== 2);

    takeLastWhile(data, predicate);

    expect(predicate.mock.calls).toStrictEqual([
      [4, 3, data],
      [3, 2, data],
      [2, 1, data],
    ]);
  });

  it('scans every item backward when all pass', () => {
    const data = [1, 2, 3];
    const predicate = vi.fn<
      (value: number, index: number, data: ReadonlyArray<number>) => boolean
    >(constant(true));

    takeLastWhile(data, predicate);

    expect(predicate.mock.calls).toStrictEqual([
      [3, 2, data],
      [2, 1, data],
      [1, 0, data],
    ]);
  });

  it('keeps holes after the last failure', () => {
    expect(
      takeLastWhile(
        // eslint-disable-next-line no-sparse-arrays -- The hole is the case under test.
        [0, , 3],
        (value) => value !== 0,
      ),
    ).toStrictEqual(
      // eslint-disable-next-line no-sparse-arrays -- The hole is the case under test.
      [, 3],
    );
  });

  it('reads holes as undefined when every item passes', () => {
    // eslint-disable-next-line no-sparse-arrays -- The hole is the case under test.
    expect(takeLastWhile([1, , 3], constant(true))).toStrictEqual([
      1,
      undefined,
      3,
    ]);
  });
});

describe('data last', () => {
  it('should return items after the last predicate failure', () => {
    expect(
      pipe(
        [1, 2, 3, 4],
        takeLastWhile((n) => n !== 2),
      ),
    ).toStrictEqual([3, 4]);
  });

  it('should return an empty array when the last item fails the predicate', () => {
    expect(
      pipe(
        [1, 2, 3, 4],
        takeLastWhile((n) => n !== 4),
      ),
    ).toStrictEqual([]);
  });

  it('should return rest of the items when first item fails the predicate', () => {
    expect(
      pipe(
        [1, 2, 3, 4],
        takeLastWhile((n) => n !== 1),
      ),
    ).toStrictEqual([2, 3, 4]);
  });

  it('should return an empty array when an empty array is passed', () => {
    expect(
      pipe(
        [],
        takeLastWhile((n) => n > 0),
      ),
    ).toStrictEqual([]);
  });

  it('should return a copy of the original array when all items pass the predicate', () => {
    const data = [1, 2, 3, 4];
    const result = pipe(
      data,
      takeLastWhile((n) => n > 0),
    );

    expect(result).toStrictEqual(data);
    expect(result).not.toBe(data);
  });

  it('keeps holes after a lone lazy step', () => {
    expect(
      pipe(
        // eslint-disable-next-line no-sparse-arrays -- The hole is the case under test.
        [0, , 3],
        // With no lazy function to fuse with, `take` runs its data-first
        // implementation, a `slice`, which keeps the hole.
        take(Infinity),
        takeLastWhile((value) => value !== 0),
      ),
    ).toStrictEqual(
      // eslint-disable-next-line no-sparse-arrays -- The hole is the case under test.
      [, 3],
    );
  });
});
