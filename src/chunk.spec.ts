import { describe, expect, it } from 'vitest';
import { chunk } from './chunk';
import { filter } from './filter';
import { pipe } from './pipe';
import { range } from './range';
import { take } from './take';

describe('data first', () => {
  it('equal size', () => {
    expect(chunk(['a', 'b', 'c', 'd'], 2)).toStrictEqual([
      ['a', 'b'],
      ['c', 'd'],
    ]);
  });

  it('not equal size', () => {
    expect(chunk(['a', 'b', 'c', 'd'], 3)).toStrictEqual([
      ['a', 'b', 'c'],
      ['d'],
    ]);
  });

  it('1 element', () => {
    expect(chunk(['x'], 3)).toStrictEqual([
      ['x'],
    ]);
  });

  it('empty array', () => {
    expect(chunk([], 3)).toStrictEqual([]);
  });

  it('keeps NaN and -0', () => {
    expect(chunk([NaN, -0, 0], 2)).toStrictEqual([
      [NaN, -0],
      [0],
    ]);
  });
});

describe('data last', () => {
  it('equal size', () => {
    expect(chunk(2)(['a', 'b', 'c', 'd'])).toStrictEqual([
      ['a', 'b'],
      ['c', 'd'],
    ]);
  });

  it('empty array', () => {
    expect(pipe([], chunk(2))).toStrictEqual([]);
  });

  it('a partial last chunk', () => {
    expect(pipe([1, 2, 3, 4, 5], chunk(2))).toStrictEqual([
      [1, 2],
      [3, 4],
      [5],
    ]);
  });

  it('size equal to the length', () => {
    expect(pipe([1, 2, 3], chunk(3))).toStrictEqual([
      [1, 2, 3],
    ]);
  });

  it('infinite size', () => {
    expect(pipe([1, 2, 3], chunk(Infinity))).toStrictEqual([
      [1, 2, 3],
    ]);
  });

  it('throws on a size under 1 even on an empty array', () => {
    expect(() => pipe([], chunk(0))).toThrow(
      new RangeError(
        'chunk: A chunk size of \'0\' would result in an infinite array',
      ),
    );
  });

  it('a NaN size on an empty array', () => {
    expect(pipe([], chunk(NaN))).toStrictEqual([]);
  });

  it('keeps holes across chunks', () => {
    expect(
      pipe(
        // eslint-disable-next-line no-sparse-arrays -- The hole is the case under test.
        [1, , 3, 4],
        chunk(2),
      ),
    ).toStrictEqual([
      // eslint-disable-next-line no-sparse-arrays -- The hole is the case under test.
      [1, ,],
      [3, 4],
    ]);
  });

  it('chunks only the items that reach it', () => {
    expect(
      pipe(
        [1, 2, 3, 4, 5],
        filter((x) => x % 2 === 1),
        chunk(2),
      ),
    ).toStrictEqual([
      [1, 3],
      [5],
    ]);
  });

  it('before a stopper that ends on the partial last chunk', () => {
    expect(pipe([1, 2, 3, 4, 5], chunk(2), take(3))).toStrictEqual([
      [1, 2],
      [3, 4],
      [5],
    ]);
  });

  it('before a stopper that ends before the partial last chunk', () => {
    expect(pipe([1, 2, 3, 4, 5], chunk(2), take(2))).toStrictEqual([
      [1, 2],
      [3, 4],
    ]);
  });

  describe('fractional sizes', () => {
    it('cut at multiples of the size', () => {
      expect(pipe(range(0, 10), chunk<number>(2.5))).toStrictEqual([
        [0, 1],
        [2, 3, 4],
        [5, 6],
        [7, 8, 9],
      ]);
    });
  });
});

describe('edge-cases', () => {
  it('throws on 0 size', () => {
    expect(() => chunk(['a', 'b', 'c', 'd'], 0)).toThrow(
      new RangeError(
        'chunk: A chunk size of \'0\' would result in an infinite array',
      ),
    );
  });

  it('throws on negative size', () => {
    expect(() => chunk(['a', 'b', 'c', 'd'], -10)).toThrow(
      new RangeError(
        'chunk: A chunk size of \'-10\' would result in an infinite array',
      ),
    );
  });

  it('throws on a fractional size under 1', () => {
    expect(() => chunk(['a', 'b', 'c', 'd'], 0.5)).toThrow(
      new RangeError(
        'chunk: A chunk size of \'0.5\' would result in an infinite array',
      ),
    );
  });

  it('throws on -Infinity size', () => {
    expect(() => chunk(['a', 'b', 'c', 'd'], -Infinity)).toThrow(
      new RangeError(
        'chunk: A chunk size of \'-Infinity\' would result in an infinite array',
      ),
    );
  });

  it('throws on a size under 1 even on an empty array', () => {
    expect(() => chunk([], 0)).toThrow(
      new RangeError(
        'chunk: A chunk size of \'0\' would result in an infinite array',
      ),
    );
  });

  it('a NaN size on an empty array', () => {
    expect(chunk([], NaN)).toStrictEqual([]);
  });

  it('size > data.length', () => {
    const data = [1, 2, 3] as const;
    const result = chunk(data, 10);

    expect(result).toStrictEqual([data]);
    // We expect the result to be a shallow clone
    expect(result[0]).not.toBe(data);
  });

  it('size equal to data.length', () => {
    expect(chunk([1, 2, 3], 3)).toStrictEqual([
      [1, 2, 3],
    ]);
  });

  it('infinite size', () => {
    expect(chunk([1, 2, 3], Infinity)).toStrictEqual([
      [1, 2, 3],
    ]);
  });

  it('chunk of size 1', () => {
    const data = [1, 2, 3, 4, 5] as const;
    const result = chunk(data, 1);

    expect(result).toStrictEqual([
      [1],
      [2],
      [3],
      [4],
      [5],
    ]);
  });

  describe('holes', () => {
    it('kept across chunks', () => {
      expect(
        chunk(
          // eslint-disable-next-line no-sparse-arrays -- The hole is the case under test.
          [1, , 3, 4],
          2,
        ),
      ).toStrictEqual([
        // eslint-disable-next-line no-sparse-arrays -- The hole is the case under test.
        [1, ,],
        [3, 4],
      ]);
    });

    it('filled in a single chunk', () => {
      // eslint-disable-next-line no-sparse-arrays -- The hole is the case under test.
      expect(chunk([1, , 3], 3)).toStrictEqual([
        [1, undefined, 3],
      ]);
    });

    it('filled in chunks of size 1', () => {
      // eslint-disable-next-line no-sparse-arrays -- The hole is the case under test.
      expect(chunk([1, , 3], 1)).toStrictEqual([
        [1],
        [undefined],
        [3],
      ]);
    });
  });

  describe('fractional sizes', () => {
    it('cut at multiples of the size', () => {
      expect(chunk<Array<number>, number>(range(0, 10), 2.5)).toStrictEqual([
        [0, 1],
        [2, 3, 4],
        [5, 6],
        [7, 8, 9],
      ]);
    });

    it('between 1 and 2', () => {
      expect(chunk<Array<number>, number>(range(0, 4), 1.5)).toStrictEqual([
        [0],
        [1, 2],
        [3],
      ]);
    });
  });
});

describe('known issues!', () => {
  describe('a NaN size', () => {
    it('throws a generic error', () => {
      // `NaN` fails every comparison, so it slips past the size guard and
      // reaches `new Array(NaN)`.
      expect(() => chunk(['a', 'b', 'c', 'd'], NaN)).not.toThrow(/^chunk: /u);

      // Actual
      expect(() => chunk(['a', 'b', 'c', 'd'], NaN)).toThrow(
        new RangeError('Invalid array length'),
      );
    });
  });

  describe('fractional sizes', () => {
    it('float rounding can drop an item', () => {
      const result = chunk<Array<number>, number>(range(0, 12), 1.2);

      // Chunk `k` ends at `k * size + size` but chunk `k + 1` starts at
      // `(k + 1) * size`, and in floating point the two can truncate to
      // different integers. The chunk count, `Math.ceil(length / size)`, can
      // round up too.
      expect(result).not.toStrictEqual([
        [0],
        [1],
        [2],
        [3],
        [4, 5],
        [6],
        [7],
        [8],
        [9],
        [10, 11],
      ]);

      // Actual
      expect(result).toStrictEqual([
        [0],
        [1],
        [2],
        [3],
        [4, 5],
        [6],
        [7],
        [8],
        [9],
        [10],
      ]);
    });

    it('float rounding can end with an empty chunk', () => {
      const result = chunk<Array<number>, number>(range(0, 21), 1.4).slice(-3);

      expect(result).not.toStrictEqual([
        [16, 17],
        [18],
        [19, 20],
      ]);

      // Actual
      expect(result).toStrictEqual([
        [18],
        [19],
        [],
      ]);
    });

    it('float rounding can repeat an item', () => {
      const result = chunk<Array<number>, number>(range(0, 58), 2.28).slice(-2);

      expect(result).not.toStrictEqual([
        [54, 55, 56],
        [57],
      ]);

      // Actual
      expect(result).toStrictEqual([
        [54, 55, 56],
        [56, 57],
      ]);
    });
  });
});
