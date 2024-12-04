import { findLast } from './find-last';
import { pipe } from './pipe';

describe('data first', () => {
  it('findLast', () => {
    expect(findLast([1, 2, 3, 4], (x) => x % 2 === 1)).toBe(3);
  });
  it('indexed', () => {
    expect(findLast([1, 2, 3, 4], (x, i) => x === 3 && i === 2)).toBe(3);
  });
  it('findLast first value', () => {
    expect(findLast([1, 2, 3, 4], (x) => x === 1)).toBe(1);
  });
  it('findLast no match', () => {
    expect(findLast([1, 2, 3, 4], (x) => x === 5)).toBeUndefined();
  });
});

describe('data last', () => {
  it('findLast', () => {
    expect(
      pipe(
        [1, 2, 3, 4],
        findLast((x) => x % 2 === 1),
      ),
    ).toBe(3);
  });

  it('indexed', () => {
    expect(
      pipe(
        [1, 2, 3, 4],
        findLast((x, i) => x === 3 && i === 2),
      ),
    ).toBe(3);
  });
});
