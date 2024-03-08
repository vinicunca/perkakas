import { describe, expect, it } from 'vitest';

import { sortedIndexBy } from './sorted-index-by';

describe('runtime correctness', () => {
  it('empty array', () => {
    expect(sortedIndexBy([], { age: 21 }, ({ age }) => age)).toBe(0);
  });

  describe('array with single item', () => {
    it('item smaller than item in array', () => {
      expect(sortedIndexBy([{ age: 22 }], { age: 21 }, ({ age }) => age)).toBe(
        0,
      );
    });

    it('item larger than item in array', () => {
      expect(sortedIndexBy([{ age: 20 }], { age: 21 }, ({ age }) => age)).toBe(
        1,
      );
    });

    it('item in array', () => {
      expect(sortedIndexBy([{ age: 21 }], { age: 21 }, ({ age }) => age)).toBe(
        0,
      );
    });
  });

  describe('array with multiple values', () => {
    it('item smaller than all items in array', () => {
      expect(
        sortedIndexBy(
          [{ age: 21 }, { age: 22 }, { age: 23 }, { age: 24 }, { age: 25 }],
          { age: 20 },
          ({ age }) => age,
        ),
      ).toBe(0);
    });

    it('item larger than all items in array', () => {
      expect(
        sortedIndexBy(
          [{ age: 21 }, { age: 22 }, { age: 23 }, { age: 24 }, { age: 25 }],
          { age: 26 },
          ({ age }) => age,
        ),
      ).toBe(5);
    });

    it('item in array', () => {
      expect(
        sortedIndexBy(
          [{ age: 21 }, { age: 22 }, { age: 23 }, { age: 24 }, { age: 25 }],
          { age: 23 },
          ({ age }) => age,
        ),
      ).toBe(2);
    });
  });

  describe('array with duplicates', () => {
    it('item smaller than all items in array', () => {
      expect(
        sortedIndexBy(
          [{ age: 21 }, { age: 21 }, { age: 21 }, { age: 21 }, { age: 21 }],
          { age: 20 },
          ({ age }) => age,
        ),
      ).toBe(0);
    });

    it('item larger than all items in array', () => {
      expect(
        sortedIndexBy(
          [{ age: 21 }, { age: 21 }, { age: 21 }, { age: 21 }, { age: 21 }],
          { age: 22 },
          ({ age }) => age,
        ),
      ).toBe(5);
    });

    it('item in array', () => {
      expect(
        sortedIndexBy(
          [{ age: 21 }, { age: 21 }, { age: 21 }, { age: 21 }, { age: 21 }],
          { age: 21 },
          ({ age }) => age,
        ),
      ).toBe(0);
    });
  });

  describe('string array', () => {
    it('item smaller than all items in array', () => {
      expect(
        sortedIndexBy(
          [
            { name: 'a' },
            { name: 'b' },
            { name: 'c' },
            { name: 'd' },
            { name: 'e' },
          ],
          { name: ' ' },
          ({ name }) => name,
        ),
      ).toBe(0);
    });

    it('item larger than all items in array', () => {
      expect(
        sortedIndexBy(
          [
            { name: 'a' },
            { name: 'b' },
            { name: 'c' },
            { name: 'd' },
            { name: 'e' },
          ],
          { name: 'z' },
          ({ name }) => name,
        ),
      ).toBe(5);
    });

    it('item in array', () => {
      expect(
        sortedIndexBy(
          [
            { name: 'a' },
            { name: 'b' },
            { name: 'c' },
            { name: 'd' },
            { name: 'e' },
          ],
          { name: 'c' },
          ({ name }) => name,
        ),
      ).toBe(2);
    });
  });
});

describe('binary search correctness via indexed', () => {
  it('empty array', () => {
    // The value function always gets called for the item with index `undefined`
    expect(indicesSeen([], { age: 21 }, ({ age }) => age)).toEqual([undefined]);
  });

  it('before all', () => {
    expect(
      indicesSeen(
        [
          { age: 21 },
          { age: 22 },
          { age: 23 },
          { age: 24 },
          { age: 25 },
          { age: 26 },
          { age: 27 },
          { age: 28 },
          { age: 29 },
          { age: 30 },
          { age: 31 },
          { age: 32 },
          { age: 33 },
          { age: 34 },
          { age: 35 },
          { age: 36 },
        ],
        { age: 20 },
        ({ age }) => age,
      ),
    ).toEqual([undefined, 8, 4, 2, 1, 0]);
  });

  it('after all', () => {
    expect(
      indicesSeen(
        [
          { age: 21 },
          { age: 22 },
          { age: 23 },
          { age: 24 },
          { age: 25 },
          { age: 26 },
          { age: 27 },
          { age: 28 },
          { age: 29 },
          { age: 30 },
          { age: 31 },
          { age: 32 },
          { age: 33 },
          { age: 34 },
          { age: 35 },
          { age: 36 },
        ],
        { age: 40 },
        ({ age }) => age,
      ),
    ).toEqual([undefined, 8, 12, 14, 15]);
  });

  it('inside the array', () => {
    expect(
      indicesSeen(
        [
          { age: 21 },
          { age: 22 },
          { age: 23 },
          { age: 24 },
          { age: 25 },
          { age: 26 },
          { age: 27 },
          { age: 28 },
          { age: 29 },
          { age: 30 },
          { age: 31 },
          { age: 32 },
          { age: 33 },
          { age: 34 },
          { age: 35 },
          { age: 36 },
        ],
        { age: 27 },
        ({ age }) => age,
      ),
    ).toEqual([undefined, 8, 4, 6, 5]);
  });

  it('with duplicates', () => {
    expect(
      indicesSeen(
        [
          { age: 27 },
          { age: 27 },
          { age: 27 },
          { age: 27 },
          { age: 27 },
          { age: 27 },
          { age: 27 },
          { age: 42 },
          { age: 42 },
          { age: 42 },
          { age: 42 },
          { age: 42 },
          { age: 42 },
          { age: 42 },
          { age: 42 },
          { age: 42 },
        ],
        { age: 27 },
        ({ age }) => age,
      ),
    ).toEqual([undefined, 8, 4, 2, 1, 0]);
  });
});

function indicesSeen<T>(
  items: ReadonlyArray<T>,
  item: T,
  valueFunction: (item: T) => NonNullable<unknown>,
): ReadonlyArray<number | undefined> {
  const indices: Array<number | undefined> = [];
  sortedIndexBy.indexed(items, item, (pivot, index) => {
    indices.push(index);
    return valueFunction(pivot);
  });
  return indices;
}
