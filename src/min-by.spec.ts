import { describe, expect, it } from 'vitest';

import { pipe } from '../pipe';
import { minBy } from './min-by';

const array = [{ a: 2 }, { a: 5 }, { a: 1 }, { a: 3 }] as const;
const expected = { a: 1 };

describe('data first', () => {
  it('minBy', () => {
    expect(minBy(array, (x) => x.a)).toEqual(expected);
  });
  it('minBy.indexed', () => {
    expect(minBy.indexed(array, (x, idx) => x.a + idx)).toEqual({ a: 2 });
  });
});

describe('data last', () => {
  it('minBy', () => {
    const actual = pipe(
      array,
      minBy((x) => x.a),
    );
    expect(actual).toEqual(expected);
  });

  it('minBy.indexed', () => {
    const actual = pipe(
      array,
      minBy.indexed((x, idx) => x.a + idx),
    );
    expect(actual).toEqual({ a: 2 });
  });
});
