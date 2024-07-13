import { groupBy } from './group-by';
import { pipe } from './pipe';
import { prop } from './prop';

describe('data first', () => {
  it('groupBy', () => {
    expect(
      groupBy(
        [
          { a: 1, b: 1 },
          { a: 1, b: 2 },
          { a: 2, b: 1 },
          { a: 1, b: 3 },
        ],
        prop('a'),
      ),
    ).toEqual({
      1: [
        { a: 1, b: 1 },
        { a: 1, b: 2 },
        { a: 1, b: 3 },
      ],
      2: [{ a: 2, b: 1 }],
    });
  });
});

describe('data last', () => {
  it('groupBy', () => {
    expect(
      pipe(
        [
          { a: 1, b: 1 },
          { a: 1, b: 2 },
          { a: 2, b: 1 },
          { a: 1, b: 3 },
        ],
        groupBy(prop('a')),
      ),
    ).toEqual({
      1: [
        { a: 1, b: 1 },
        { a: 1, b: 2 },
        { a: 1, b: 3 },
      ],
      2: [{ a: 2, b: 1 }],
    });
  });
});

describe('filtering on undefined grouper result', () => {
  // These tests use a contrived example that is basically a simple filter. The
  // goal of these tests is to make sure that all flavours of the function
  // accept an undefined return value for the grouper function, and that it
  // works in all the cases, including the typing.

  it('regular', () => {
    const result = groupBy([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], (x) =>
      x % 2 === 0 ? 'even' : undefined);
    expect(Object.values(result)).toHaveLength(1);
    expect(result.even).toEqual([0, 2, 4, 6, 8]);
  });

  it('regular indexed', () => {
    const result = groupBy(
      ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'],
      (_, index) => (index % 2 === 0 ? 'even' : undefined),
    );
    expect(Object.values(result)).toHaveLength(1);
    expect(result.even).toEqual(['a', 'c', 'e', 'g', 'i']);
  });
});
