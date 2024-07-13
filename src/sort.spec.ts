import { pipe } from './pipe';
import { sort } from './sort';

describe('data_first', () => {
  it('sort', () => {
    expect(sort([4, 2, 7, 5], (a, b) => a - b)).toEqual([2, 4, 5, 7]);
  });
});

describe('data_last', () => {
  it('sort', () => {
    expect(
      pipe(
        [4, 2, 7, 5],
        sort((a, b) => a - b),
      ),
    ).toEqual([2, 4, 5, 7]);
  });
});
