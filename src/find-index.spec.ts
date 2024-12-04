import { findIndex } from './find-index';
import { pipe } from './pipe';

describe('data first', () => {
  it('found', () => {
    expect(findIndex([10, 20, 30], (x) => x === 20)).toBe(1);
  });

  it('not found', () => {
    expect(findIndex([2, 3, 4], (x) => x === 20)).toBe(-1);
  });
});

describe('data last', () => {
  it('found', () => {
    expect(
      pipe(
        [10, 20, 30],
        findIndex((x) => x === 20),
      ),
    ).toBe(1);
  });

  it('not found', () => {
    expect(
      pipe(
        [2, 3, 4],
        findIndex((x) => x === 20),
      ),
    ).toBe(-1);
  });
});
