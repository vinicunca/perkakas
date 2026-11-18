import { describe, expect, it } from 'vitest';
import { filter } from './filter';
import { pipe } from './pipe';
import { splice } from './splice';
import { take } from './take';

describe('typical cases', (): void => {
  it('removing a element', (): void => {
    expect(splice([1, 2, 3], 0, 1, [])).toStrictEqual([2, 3]);
  });

  it('inserting a element', (): void => {
    expect(splice([1, 2, 3], 0, 0, [4])).toStrictEqual([4, 1, 2, 3]);
  });

  it('removing elements and inserting elements', (): void => {
    expect(splice([1, 2, 3], 0, 2, [4, 5])).toStrictEqual([4, 5, 3]);
  });
});

it('immutability', () => {
  const data = [1, 2, 3];
  const result = splice(data, 0, 0, []);

  expect(result).toStrictEqual(data);
  expect(result).not.toBe(data);
});

describe('regression tests', () => {
  describe('start at array start', () => {
    describe('no deletions', () => {
      it('without replacement', () => {
        expect(splice([1, 2], 0, 0, [])).toStrictEqual([1, 2]);
      });

      it('with replacement', () => {
        expect(splice([1, 2], 0, 0, [3])).toStrictEqual([3, 1, 2]);
      });
    });

    describe('delete some', () => {
      it('without replacement', () => {
        expect(splice([1, 2], 0, 1, [])).toStrictEqual([2]);
      });

      it('with replacement', () => {
        expect(splice([1, 2], 0, 1, [3])).toStrictEqual([3, 2]);
      });
    });

    describe('delete all', () => {
      it('without replacement', () => {
        expect(splice([1, 2], 0, 2, [])).toStrictEqual([]);
      });

      it('with replacement', () => {
        expect(splice([1, 2], 0, 2, [3])).toStrictEqual([3]);
      });
    });
  });

  describe('start within the array', () => {
    describe('no deletions', () => {
      it('without replacement', () => {
        expect(splice([1, 2], 1, 0, [])).toStrictEqual([1, 2]);
      });

      it('with replacement', () => {
        expect(splice([1, 2], 1, 0, [3])).toStrictEqual([1, 3, 2]);
      });
    });

    describe('delete some', () => {
      it('without replacement', () => {
        expect(splice([1, 2], 1, 1, [])).toStrictEqual([1]);
      });

      it('with replacement', () => {
        expect(splice([1, 2], 1, 1, [3])).toStrictEqual([1, 3]);
      });
    });

    describe('delete all', () => {
      it('without replacement', () => {
        expect(splice([1, 2], 1, 2, [])).toStrictEqual([1]);
      });

      it('with replacement', () => {
        expect(splice([1, 2], 1, 2, [3])).toStrictEqual([1, 3]);
      });
    });
  });

  describe('start at array end', () => {
    describe('no deletions', () => {
      it('without replacement', () => {
        expect(splice([1, 2], 2, 0, [])).toStrictEqual([1, 2]);
      });

      it('with replacement', () => {
        expect(splice([1, 2], 2, 0, [3])).toStrictEqual([1, 2, 3]);
      });
    });
  });

  describe('empty array', () => {
    describe('start at array start', () => {
      it('without replacement', () => {
        expect(splice([], 0, -1, [])).toStrictEqual([]);
      });

      it('with replacement', () => {
        expect(splice([] as Array<number>, 0, -1, [3])).toStrictEqual([3]);
      });
    });
  });
});

describe('overflow indices', () => {
  describe('negative start', () => {
    describe('negative deleteCount', () => {
      it('without replacement', () => {
        expect(splice([1, 2], -1, -1, [])).toStrictEqual([1, 2]);
      });

      it('with replacement', () => {
        expect(splice([1, 2], -1, -1, [3])).toStrictEqual([1, 3, 2]);
      });
    });

    describe('no deletions', () => {
      it('without replacement', () => {
        expect(splice([1, 2], -1, 0, [])).toStrictEqual([1, 2]);
      });

      it('with replacement', () => {
        expect(splice([1, 2], -1, 0, [3])).toStrictEqual([1, 3, 2]);
      });
    });

    describe('delete some', () => {
      it('without replacement', () => {
        expect(splice([1, 2], -1, 1, [])).toStrictEqual([1]);
      });

      it('with replacement', () => {
        expect(splice([1, 2], -1, 1, [3])).toStrictEqual([1, 3]);
      });
    });

    describe('delete all', () => {
      it('without replacement', () => {
        expect(splice([1, 2], -1, 2, [])).toStrictEqual([1]);
      });

      it('with replacement', () => {
        expect(splice([1, 2], -1, 2, [3])).toStrictEqual([1, 3]);
      });
    });
  });

  describe('negative deleteCount', () => {
    describe('start at array start', () => {
      it('without replacement', () => {
        expect(splice([1, 2], 0, -1, [])).toStrictEqual([1, 2]);
      });

      it('with replacement', () => {
        expect(splice([1, 2], 0, -1, [3])).toStrictEqual([3, 1, 2]);
      });
    });

    describe('start within the array', () => {
      it('without replacement', () => {
        expect(splice([1, 2], 1, -1, [])).toStrictEqual([1, 2]);
      });

      it('with replacement', () => {
        expect(splice([1, 2], 1, -1, [3])).toStrictEqual([1, 3, 2]);
      });
    });

    describe('start at array end', () => {
      it('without replacement', () => {
        expect(splice([1, 2], 2, -1, [])).toStrictEqual([1, 2]);
      });

      it('with replacement', () => {
        expect(splice([1, 2], 2, -1, [3])).toStrictEqual([1, 2, 3]);
      });
    });
  });

  describe('empty array', () => {
    describe('negative start', () => {
      it('without replacement', () => {
        expect(splice([], -1, -1, [])).toStrictEqual([]);
      });

      it('with replacement', () => {
        expect(splice([] as Array<number>, -1, -1, [3])).toStrictEqual([3]);
      });
    });

    describe('start > data.length', () => {
      it('without replacement', () => {
        expect(splice([], 1, -1, [])).toStrictEqual([]);
      });

      it('with replacement', () => {
        expect(splice([] as Array<number>, -1, -1, [3])).toStrictEqual([3]);
      });
    });
  });

  describe('start > data.length', () => {
    it('without replacement', () => {
      expect(splice([1, 2], 5, 1, [])).toStrictEqual([1, 2]);
    });

    it('with replacement', () => {
      expect(splice([1, 2], 5, 1, [3])).toStrictEqual([1, 2, 3]);
    });
  });
});

describe('coerced indices', () => {
  it('fractional start and deleteCount truncate', () => {
    expect(splice([1, 2, 3, 4], 1.7, 1.9)).toStrictEqual([1, 3, 4]);
  });

  it('a fractional negative start truncates toward zero', () => {
    expect(splice([1, 2, 3], -1.5, 1)).toStrictEqual([1, 2]);
  });

  it('a start between -1 and 0 counts as 0', () => {
    expect(splice([1, 2, 3], -0.5, 1)).toStrictEqual([2, 3]);
  });

  it('a -0 start counts as 0', () => {
    expect(splice([1, 2, 3], -0, 1)).toStrictEqual([2, 3]);
  });

  it('a NaN start counts as 0', () => {
    expect(splice([1, 2, 3], NaN, 1)).toStrictEqual([2, 3]);
  });

  it('a NaN deleteCount counts as 0', () => {
    expect(splice([1, 2, 3], 1, NaN, [9])).toStrictEqual([1, 9, 2, 3]);
  });

  it('an infinite start appends the replacement', () => {
    expect(splice([1, 2], Infinity, 0, [3])).toStrictEqual([1, 2, 3]);
  });

  it('a -Infinity start counts as 0', () => {
    expect(splice([1, 2], -Infinity, 1, [3])).toStrictEqual([3, 2]);
  });

  it('a negative start past the beginning counts as 0', () => {
    expect(splice([1, 2], -5, 1, [3])).toStrictEqual([3, 2]);
  });

  it('an infinite deleteCount deletes the rest', () => {
    expect(splice([1, 2, 3], 1, Infinity, [9])).toStrictEqual([1, 9]);
  });
});

describe('items', () => {
  it('keeps NaN and -0', () => {
    expect(splice([NaN, -0, 1], 2, 1)).toStrictEqual([NaN, -0]);
  });
});

it('a purried data-last implementation', () => {
  expect(pipe([1, 2, 3, 4, 5, 6, 7, 8], splice(2, 3, [9, 10]))).toStrictEqual([
    1,
    2,
    9,
    10,
    6,
    7,
    8,
  ]);
});

describe('replacement defaults to an empty array', () => {
  it('data-first', () => {
    expect(splice([1, 2, 3, 4, 5], 1, 2)).toStrictEqual(
      splice([1, 2, 3, 4, 5], 1, 2, []),
    );
  });

  it('data-last', () => {
    expect(pipe([1, 2, 3, 4, 5], splice(1, 2))).toStrictEqual(
      pipe([1, 2, 3, 4, 5], splice(1, 2, [])),
    );
  });
});

describe('in a pipe', () => {
  it('returns a new array', () => {
    const data = [1, 2, 3];

    expect(pipe(data, splice(0, 0, []))).not.toBe(data);
  });

  it('an empty array gives the replacement', () => {
    const data: Array<number> = [];

    expect(pipe(data, splice(0, 0, [1]))).toStrictEqual([1]);
  });

  it('an empty array gives the replacement for any start', () => {
    const data: Array<number> = [];

    expect(pipe(data, splice(3, 2, [1]))).toStrictEqual([1]);
  });

  it('inserts before the item at start when nothing is deleted', () => {
    expect(pipe([1, 2, 3], splice(1, 0, [9]))).toStrictEqual([1, 9, 2, 3]);
  });

  it('a start at the end appends the replacement', () => {
    expect(pipe([1, 2], splice(2, 0, [3]))).toStrictEqual([1, 2, 3]);
  });

  it('a start past the end appends the replacement', () => {
    expect(pipe([1, 2], splice(5, 1, [3]))).toStrictEqual([1, 2, 3]);
  });

  it('deletes up to the end', () => {
    expect(pipe([1, 2, 3], splice(1, 5, [9]))).toStrictEqual([1, 9]);
  });

  it('fractional start and deleteCount truncate', () => {
    expect(pipe([1, 2, 3, 4], splice(1.7, 1.9))).toStrictEqual([1, 3, 4]);
  });

  it('a -0 start counts as 0', () => {
    expect(pipe([1, 2, 3], splice(-0, 1))).toStrictEqual([2, 3]);
  });

  it('a start between -1 and 0 counts as 0', () => {
    expect(pipe([1, 2, 3], splice(-0.5, 1))).toStrictEqual([2, 3]);
  });

  it('a NaN start counts as 0', () => {
    expect(pipe([1, 2, 3], splice(NaN, 1))).toStrictEqual([2, 3]);
  });

  it('a NaN deleteCount counts as 0', () => {
    expect(pipe([1, 2, 3], splice(1, NaN, [9]))).toStrictEqual([1, 9, 2, 3]);
  });

  it('a negative deleteCount counts as 0', () => {
    expect(pipe([1, 2, 3], splice(1, -1, [9]))).toStrictEqual([1, 9, 2, 3]);
  });

  it('an infinite start appends the replacement', () => {
    expect(pipe([1, 2], splice(Infinity, 0, [3]))).toStrictEqual([1, 2, 3]);
  });

  it('an infinite deleteCount deletes the rest', () => {
    expect(pipe([1, 2, 3], splice(1, Infinity, [9]))).toStrictEqual([1, 9]);
  });

  it('counts positions among the items that reach it', () => {
    expect(
      pipe(
        [1, 2, 3, 4, 5],
        filter((x) => x % 2 === 1),
        splice(1, 1),
      ),
    ).toStrictEqual([1, 5]);
  });

  it('before a stopper that ends inside the replacement', () => {
    expect(pipe([1, 2, 3], splice(1, 1, [7, 8]), take(2))).toStrictEqual([
      1,
      7,
    ]);
  });

  it('before a stopper that ends inside an appended replacement', () => {
    expect(pipe([1, 2, 3], splice(5, 0, [7, 8]), take(4))).toStrictEqual([
      1,
      2,
      3,
      7,
    ]);
  });
});
