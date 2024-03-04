import { describe, expect, it } from 'vitest';

import { pipe } from '../function/pipe';
import { countBy } from './count-by';

describe('data first', () => {
  it('countBy', () => {
    expect(countBy([1, 2, 3, 4, 5], (x) => x % 2 === 0)).toEqual(2);
  });
  it('countBy.indexed', () => {
    expect(countBy.indexed([1, 2, 3, 4, 5], (x) => x % 2 === 0)).toEqual(2);
  });
});

describe('data last', () => {
  it('countBy', () => {
    expect(
      pipe(
        [1, 2, 3, 4, 5],
        countBy((x) => x % 2 === 0),
      ),
    ).toEqual(2);
  });
  it('countBy.indexed', () => {
    expect(
      pipe(
        [1, 2, 3, 4, 5],
        countBy.indexed((x) => x % 2 === 0),
      ),
    ).toEqual(2);
  });
});
