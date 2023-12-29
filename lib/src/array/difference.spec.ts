import { describe, expect, it, vi } from 'vitest';

import { pipe } from '../function';
import { difference } from './difference';
import { map } from './map';
import { take } from './take';

const source = [1, 2, 3, 4] as const;
const other = [2, 5, 3] as const;
const expected = [1, 4] as const;

describe('data_first', () => {
  it('should return difference', () => {
    expect(difference(source, other)).toEqual(expected);
  });
});

describe('data_last', () => {
  it('should return difference', () => {
    expect(difference(other)(source)).toEqual(expected);
  });

  it('lazy', () => {
    const count = vi.fn();
    const result = pipe(
      [1, 2, 3, 4, 5, 6],
      map((x) => {
        count();
        return x;
      }),
      difference([2, 3]),
      take(2),
    );
    expect(count).toHaveBeenCalledTimes(4);
    expect(result).toEqual([1, 4]);
  });
});
