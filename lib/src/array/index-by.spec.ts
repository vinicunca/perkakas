import { describe, expect, it } from 'vitest';

import { pipe } from '../function/pipe';
import { indexBy } from './index-by';

const array = [
  { code: 97, dir: 'left' },
  { code: 100, dir: 'right' },
] as const;
const expected = {
  left: { code: 97, dir: 'left' },
  right: { code: 100, dir: 'right' },
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
