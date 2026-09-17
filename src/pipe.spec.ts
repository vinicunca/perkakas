/* eslint-disable ts/no-use-before-define */
import type { LazyCallback } from './internal/types/lazy-callback';
import type { LazyEvaluator } from './internal/types/lazy-evaluator';
import { describe, expect, it, vi } from 'vitest';
import { filter } from './filter';
import { flat } from './flat';
import { identity } from './identity';
import { curryFromLazy } from './internal/curry-from-lazy';
import { map } from './map';
import { pipe } from './pipe';
import { prop } from './prop';
import { take } from './take';

it('should pass through data with 0 functions', () => {
  const data = { a: 'hello', b: 123 };

  expect(pipe(data)).toBe(data);
});

it('should pipe a single operation', () => {
  const result = pipe(1, (x) => x * 2);

  expect(result).toBe(2);
});

it('should pipe operations', () => {
  const result = pipe(
    1,
    (x) => x * 2,
    (x) => x * 3,
  );

  expect(result).toBe(6);
});

describe('lazy', () => {
  it('lazy map + take', () => {
    const count = vi.fn<() => void>();
    const result = pipe(
      [1, 2, 3],
      map((x) => {
        count();
        return x * 10;
      }),
      take(2),
    );

    expect(count).toHaveBeenCalledTimes(2);
    expect(result).toStrictEqual([10, 20]);
  });

  it('lazy map + filter + take', () => {
    const count = vi.fn<() => void>();
    const result = pipe(
      [1, 2, 3, 4, 5],
      map((x) => {
        count();
        return x * 10;
      }),
      filter((x) => (x / 10) % 2 === 1),
      take(2),
    );

    expect(count).toHaveBeenCalledTimes(3);
    expect(result).toStrictEqual([10, 30]);
  });

  it('lazy after 1st op', () => {
    const count = vi.fn<() => void>();
    const result = pipe(
      { inner: [1, 2, 3] },
      prop('inner'),
      map((x) => {
        count();
        return x * 10;
      }),
      take(2),
    );

    expect(count).toHaveBeenCalledTimes(2);
    expect(result).toStrictEqual([10, 20]);
  });

  it('break lazy', () => {
    const count = vi.fn<() => void>();
    const result = pipe(
      [1, 2, 3],
      map((x) => {
        count();
        return x * 10;
      }),
      (x) => x,
      take(2),
    );

    expect(count).toHaveBeenCalledTimes(3);
    expect(result).toStrictEqual([10, 20]);
  });

  it('multiple take', () => {
    const count = vi.fn<() => void>();
    const result = pipe(
      [1, 2, 3],
      map((x) => {
        count();
        return x * 10;
      }),
      take(2),
      take(1),
    );

    expect(count).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual([10]);
  });

  it('multiple lazy', () => {
    const count = vi.fn<() => void>();
    const count2 = vi.fn<() => void>();
    const result = pipe(
      [1, 2, 3, 4, 5, 6, 7],
      map((x) => {
        count();
        return x * 10;
      }),
      take(4),
      identity(),
      map((x) => {
        count2();
        return x * 10;
      }),
      take(2),
    );

    expect(count).toHaveBeenCalledTimes(4);
    expect(count2).toHaveBeenCalledTimes(2);
    expect(result).toStrictEqual([100, 200]);
  });

  it('early exit when done without a next value', () => {
    const mockMapper = vi.fn<(x: number) => number>();

    expect(pipe([1, 2, 3, 4, 5], map(mockMapper), take(0))).toStrictEqual([]);
    // An element must be pulled before `take(0)` can report `done`, so the
    // callback runs exactly once even though the result is empty.
    expect(mockMapper).toHaveBeenCalledTimes(1);
  });

  it('early exit when done without a next value mid-pipe', () => {
    const mockMapper = vi.fn<(x: number) => number>();
    const downstream = vi.fn<(x: number) => number>();

    expect(
      pipe([1, 2, 3, 4, 5], map(mockMapper), take(0), map(downstream)),
    ).toStrictEqual([]);
    expect(mockMapper).toHaveBeenCalledTimes(1);
    expect(downstream).not.toHaveBeenCalled();
  });

  it('lazy early exit with hasMany', () => {
    const result = pipe(
      [
        [1, 2],
        [3, 4],
        [5, 6],
      ],
      take(1),
      flat(),
    );

    expect(result).toStrictEqual([1, 2]);
  });

  it('early exit when done with many next values', () => {
    const mockMapper = vi.fn<(x: number) => number>(identity());

    expect(pipe([1, 2, 3, 4, 5], map(mockMapper), firstTwice())).toStrictEqual([
      1,
      1,
    ]);
    expect(mockMapper).toHaveBeenCalledTimes(1);
  });

  it('callbacks receive the items processed so far', () => {
    const mock = vi.fn<LazyCallback<Array<unknown>, unknown>>(
      (_value, _index, data) => [...data],
    );
    pipe([1, 2, 3], map(mock));

    expect(mock).toHaveNthReturnedWith(1, [1]);
    expect(mock).toHaveNthReturnedWith(2, [1, 2]);
    expect(mock).toHaveNthReturnedWith(3, [1, 2, 3]);
  });
});

// We want to test a lazy evaluator that returns both `done === true` and
// `hasMany === true` at the same time but don't have any utility that does it.
const firstTwice: () => (data: ReadonlyArray<number>) => Array<number> = () =>
  // @ts-expect-error [ts2322] -- Our curry functions don't infer the correct return type, we explicit casting to force it.
  curryFromLazy(() => firstTwiceEvaluator, []);

const firstTwiceEvaluator: LazyEvaluator = (value) => ({
  done: true,
  hasNext: true,
  hasMany: true,
  next: [value, value],
});
