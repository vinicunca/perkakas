import { describe, expect, it } from 'vitest';

import { pipe } from '../pipe';
import { reduce } from './reduce';

const array = [1, 2, 3, 4, 5] as const;

describe('data first', () => {
  it('reduce', () => {
    expect(reduce(array, (acc, x) => acc + x, 100)).toEqual(115);
  });
  it('reduce.indexed', () => {
    let i = 0;
    expect(
      reduce.indexed(
        array,
        (acc, x, index, items) => {
          expect(index).toBe(i);
          expect(items).toBe(array);
          i++;
          return acc + x;
        },
        100,
      ),
    ).toEqual(115);
  });
});

describe('data last', () => {
  it('reduce', () => {
    expect(
      pipe(
        array,
        reduce((acc, x) => acc + x, 100),
      ),
    ).toEqual(115);
  });

  it('reduce.indexed', () => {
    expect(
      pipe(
        array,
        reduce.indexed((acc, x) => acc + x, 100),
      ),
    ).toEqual(115);
  });
});
