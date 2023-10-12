import { describe, expect, it } from 'vitest';
import { pipe } from '../function';
import { indexBy } from './index-by';

const array = [
  { dir: 'left', code: 97 },
  { dir: 'right', code: 100 },
] as const;
const expected = {
  left: { dir: 'left', code: 97 },
  right: { dir: 'right', code: 100 },
};

describe('data first', () => {
  it('indexBy', () => {
    expect(indexBy(array, (x) => x.dir)).toEqual(expected);
  });

  it('indexBy.indexed', () => {
    expect(indexBy.indexed(array, (x) => x.dir)).toEqual(expected);
  });
});

describe('data last', () => {
  it('indexBy', () => {
    expect(
      pipe(
        array,
        indexBy((x) => x.dir),
      ),
    ).toEqual(expected);
  });

  it('indexBy.indexed', () => {
    expect(
      pipe(
        array,
        indexBy.indexed((x) => x.dir),
      ),
    ).toEqual(expected);
  });
});
