import { describe, expect, it } from 'vitest';

import { pipe } from '../function/pipe';
import { findLast } from './find-last';

const array = [1, 2, 3, 4];

describe('data first', () => {
  it('findLast', () => {
    expect(findLast(array, (x) => x % 2 === 1)).toEqual(3);
  });
  it('findLast.indexed', () => {
    expect(findLast.indexed(array, (x, i) => x === 3 && i === 2)).toEqual(3);
  });
  it('findLast first value', () => {
    expect(findLast(array, (x) => x === 1)).toEqual(1);
  });
  it('findLast no match', () => {
    expect(findLast(array, (x) => x === 5)).toBeUndefined();
  });
});

describe('data last', () => {
  it('findLast', () => {
    const actual = pipe(
      [1, 2, 3, 4],
      findLast((x) => x % 2 === 1),
    );
    expect(actual).toEqual(3);
  });

  it('findLast.indexed', () => {
    const actual = pipe(
      [1, 2, 3, 4],
      findLast.indexed((x, i) => x === 3 && i === 2),
    );
    expect(actual).toEqual(3);
  });
});
