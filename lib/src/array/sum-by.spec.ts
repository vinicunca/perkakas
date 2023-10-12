import { describe, expect, it } from 'vitest';
import { pipe } from '../function';
import { sumBy } from './sum-by';

const array = [{ a: 1 }, { a: 2 }, { a: 4 }, { a: 5 }, { a: 3 }] as const;
const expected = 15;

describe('data first', () => {
  it('sumBy', () => {
    expect(sumBy(array, (x) => x.a)).toEqual(expected);
  });

  it('sumBy.indexed', () => {
    expect(sumBy.indexed(array, (x, idx) => x.a + idx)).toEqual(25);
  });
});

describe('data last', () => {
  it('sumBy', () => {
    expect(
      pipe(
        array,
        sumBy((x) => x.a),
      ),
    ).toEqual(expected);
  });

  it('sumBy.indexed', () => {
    const actual = pipe(
      array,
      sumBy.indexed((x, idx) => x.a + idx),
    );
    expect(actual).toEqual(25);
  });
});
