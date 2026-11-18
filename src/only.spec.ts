import { describe, expect, it } from 'vitest';
import { filter } from './filter';
import { only } from './only';
import { pipe } from './pipe';

describe('dataFirst', () => {
  it('empty array', () => {
    expect(only([])).toBeUndefined();
  });

  it('length 1 array', () => {
    expect(only([1])).toBe(1);
  });

  it('length 2 array', () => {
    expect(only([1, 2])).toBeUndefined();
  });

  it('length 3 array', () => {
    expect(only([1, 2, 3])).toBeUndefined();
  });

  it('returns the item itself', () => {
    const item = { a: 1 };

    expect(only([item])).toBe(item);
  });

  it('a NaN item', () => {
    expect(only([NaN])).toBeNaN();
  });

  it('a -0 item', () => {
    expect(only([-0])).toBe(-0);
  });

  it('an undefined first item still counts', () => {
    expect(only([undefined, 1])).toBeUndefined();
  });

  it('a hole counts as an item', () => {
    // eslint-disable-next-line no-sparse-arrays -- The hole is the case under test.
    expect(only([, 1])).toBeUndefined();
  });
});

describe('data last', () => {
  it('empty array', () => {
    expect(pipe([], only())).toBeUndefined();
  });

  it('length 1 array', () => {
    expect(pipe([1], only())).toBe(1);
  });

  it('length 2 array', () => {
    expect(pipe([1, 2], only())).toBeUndefined();
  });

  it('length 3 array', () => {
    expect(pipe([1, 2, 3], only())).toBeUndefined();
  });

  it('an undefined first item still counts', () => {
    expect(pipe([undefined, 1], only())).toBeUndefined();
  });

  it('counts only the items that reach it', () => {
    expect(
      pipe(
        [1, 2, 3],
        filter((x) => x > 2),
        only(),
      ),
    ).toBe(3);
  });
});

it('simple tuple', () => {
  expect(only([1, 'a'])).toBeUndefined();
});

it('tuple with last', () => {
  expect(only(['a', 1])).toBeUndefined();
});

it('tuple with two last', () => {
  expect(only(['a', 1, 2])).toBeUndefined();
});

it('tuple with first and last', () => {
  expect(only([1, 'a', 2])).toBeUndefined();
});
