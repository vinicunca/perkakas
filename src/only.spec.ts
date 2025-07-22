import { describe, expect, it } from 'vitest';
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
