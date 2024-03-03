import { describe, expect, it } from 'vitest';

import { pipe } from '../function/pipe';
import { meanBy } from './mean-by';

const array = [{ a: 1 }, { a: 2 }, { a: 4 }, { a: 5 }, { a: 3 }] as const;

describe('data first', () => {
  it('meanBy', () => {
    expect(meanBy(array, (x) => x.a)).toEqual(3);
  });

  it('meanBy.indexed', () => {
    expect(meanBy.indexed(array, (x, idx) => x.a + idx)).toEqual(5);
  });

  it('should handle empty array', () => {
    expect(meanBy([], (x) => x)).toBeNaN();
  });
});

describe('data last', () => {
  it('meanBy', () => {
    expect(
      pipe(
        array,
        meanBy((x) => x.a),
      ),
    ).toEqual(3);
  });

  it('meanBy.indexed', () => {
    expect(
      pipe(
        array,
        meanBy.indexed((x, idx) => x.a + idx),
      ),
    ).toEqual(5);
  });

  it('should handle empty array', () => {
    expect(
      pipe(
        [],
        meanBy((x) => x),
      ),
    ).toBeNaN();
  });
});
