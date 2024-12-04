import { pipe } from './pipe';
import { splice } from './splice';

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
        expect(splice([], 0, -1, [3])).toStrictEqual([3]);
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
        expect(splice([], -1, -1, [3])).toStrictEqual([3]);
      });
    });

    describe('start > data.length', () => {
      it('without replacement', () => {
        expect(splice([], 1, -1, [])).toStrictEqual([]);
      });

      it('with replacement', () => {
        expect(splice([], 1, -1, [3])).toStrictEqual([3]);
      });
    });
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
