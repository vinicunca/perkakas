import { describe, expect, expectTypeOf, it } from 'vitest';

import { pipe } from './pipe';
import { splice } from './splice';

describe('at runtime', () => {
  describe('typical cases', (): void => {
    it('removing a element', (): void => {
      expect(splice([1, 2, 3], 0, 1, [])).toEqual([2, 3]);
    });

    it('inserting a element', (): void => {
      expect(splice([1, 2, 3], 0, 0, [4])).toEqual([4, 1, 2, 3]);
    });

    it('removing elements and inserting elements', (): void => {
      expect(splice([1, 2, 3], 0, 2, [4, 5])).toEqual([4, 5, 3]);
    });
  });

  it('immutability', () => {
    const data = [1, 2, 3];
    const result = splice(data, 0, 0, []);
    expect(result).toEqual(data);
    expect(result).not.toBe(data);
  });

  describe('regression test including edge cases', () => {
    const testCases = [
      // items: multiple elements
      //              start: < 0
      //                         deleteCount: < 0
      { deleteCount: -1, expected: [1, 2], items: [1, 2], replacement: [], start: -1 },
      { deleteCount: -1, expected: [1, 3, 2], items: [1, 2], replacement: [3], start: -1 },
      //                         deleteCount: = 0
      { deleteCount: 0, expected: [1, 2], items: [1, 2], replacement: [], start: -1 },
      { deleteCount: 0, expected: [1, 3, 2], items: [1, 2], replacement: [3], start: -1 },
      //                         deleteCount: = 1
      { deleteCount: 1, expected: [1], items: [1, 2], replacement: [], start: -1 },
      { deleteCount: 1, expected: [1, 3], items: [1, 2], replacement: [3], start: -1 },
      //                         deleteCount: = items.length
      { deleteCount: 2, expected: [1], items: [1, 2], replacement: [], start: -1 },
      { deleteCount: 2, expected: [1, 3], items: [1, 2], replacement: [3], start: -1 },
      //              start: = 0
      { deleteCount: -1, expected: [1, 2], items: [1, 2], replacement: [], start: 0 },
      { deleteCount: -1, expected: [3, 1, 2], items: [1, 2], replacement: [3], start: 0 },
      { deleteCount: 0, expected: [1, 2], items: [1, 2], replacement: [], start: 0 },
      { deleteCount: 0, expected: [3, 1, 2], items: [1, 2], replacement: [3], start: 0 },
      { deleteCount: 1, expected: [2], items: [1, 2], replacement: [], start: 0 },
      { deleteCount: 1, expected: [3, 2], items: [1, 2], replacement: [3], start: 0 },
      { deleteCount: 2, expected: [], items: [1, 2], replacement: [], start: 0 },
      { deleteCount: 2, expected: [3], items: [1, 2], replacement: [3], start: 0 },
      //              start: = 1
      { deleteCount: -1, expected: [1, 2], items: [1, 2], replacement: [], start: 1 },
      { deleteCount: -1, expected: [1, 3, 2], items: [1, 2], replacement: [3], start: 1 },
      { deleteCount: 0, expected: [1, 2], items: [1, 2], replacement: [], start: 1 },
      { deleteCount: 0, expected: [1, 3, 2], items: [1, 2], replacement: [3], start: 1 },
      { deleteCount: 1, expected: [1], items: [1, 2], replacement: [], start: 1 },
      { deleteCount: 1, expected: [1, 3], items: [1, 2], replacement: [3], start: 1 },
      { deleteCount: 2, expected: [1], items: [1, 2], replacement: [], start: 1 },
      { deleteCount: 2, expected: [1, 3], items: [1, 2], replacement: [3], start: 1 },
      //              start: = items.length
      { deleteCount: -1, expected: [1, 2], items: [1, 2], replacement: [], start: 2 },
      { deleteCount: -1, expected: [1, 2, 3], items: [1, 2], replacement: [3], start: 2 },
      { deleteCount: 0, expected: [1, 2], items: [1, 2], replacement: [], start: 2 },
      { deleteCount: 0, expected: [1, 2, 3], items: [1, 2], replacement: [3], start: 2 },
      { deleteCount: 1, expected: [1, 2], items: [1, 2], replacement: [], start: 2 },
      { deleteCount: 1, expected: [1, 2, 3], items: [1, 2], replacement: [3], start: 2 },
      { deleteCount: 2, expected: [1, 2], items: [1, 2], replacement: [], start: 2 },
      { deleteCount: 2, expected: [1, 2, 3], items: [1, 2], replacement: [3], start: 2 },
      //              start: > items.length
      { deleteCount: -1, expected: [1, 2], items: [1, 2], replacement: [], start: 3 },
      { deleteCount: -1, expected: [1, 2, 3], items: [1, 2], replacement: [3], start: 3 },
      { deleteCount: 0, expected: [1, 2], items: [1, 2], replacement: [], start: 3 },
      { deleteCount: 0, expected: [1, 2, 3], items: [1, 2], replacement: [3], start: 3 },
      { deleteCount: 1, expected: [1, 2], items: [1, 2], replacement: [], start: 3 },
      { deleteCount: 1, expected: [1, 2, 3], items: [1, 2], replacement: [3], start: 3 },
      { deleteCount: 2, expected: [1, 2], items: [1, 2], replacement: [], start: 3 },
      { deleteCount: 2, expected: [1, 2, 3], items: [1, 2], replacement: [3], start: 3 },

      // items: empty
      //              start: < 0
      { deleteCount: -1, expected: [], items: [], replacement: [], start: -1 },
      { deleteCount: -1, expected: [3], items: [], replacement: [3], start: -1 },
      { deleteCount: 0, expected: [], items: [], replacement: [], start: -1 },
      { deleteCount: 0, expected: [3], items: [], replacement: [3], start: -1 },
      { deleteCount: 1, expected: [], items: [], replacement: [], start: -1 },
      { deleteCount: 1, expected: [3], items: [], replacement: [3], start: -1 },
      //              start: = items.length = 0
      { deleteCount: -1, expected: [], items: [], replacement: [], start: 0 },
      { deleteCount: -1, expected: [3], items: [], replacement: [3], start: 0 },
      { deleteCount: 0, expected: [], items: [], replacement: [], start: 0 },
      { deleteCount: 0, expected: [3], items: [], replacement: [3], start: 0 },
      { deleteCount: 1, expected: [], items: [], replacement: [], start: 0 },
      { deleteCount: 1, expected: [3], items: [], replacement: [3], start: 0 },
      //              start: > items.length = 0
      { deleteCount: -1, expected: [], items: [], replacement: [], start: 1 },
      { deleteCount: -1, expected: [3], items: [], replacement: [3], start: 1 },
      { deleteCount: 0, expected: [], items: [], replacement: [], start: 1 },
      { deleteCount: 0, expected: [3], items: [], replacement: [3], start: 1 },
      { deleteCount: 1, expected: [], items: [], replacement: [], start: 1 },
      { deleteCount: 1, expected: [3], items: [], replacement: [3], start: 1 },
    ] as const;

    it.each(testCases)(
      'splice($items, $start, $deleteCount, $replacement) -> $expected',
      ({ deleteCount, expected, items, replacement, start }) => {
        expect(splice(items, start, deleteCount, replacement)).toEqual(
          expected,
        );
      },
    );
  });

  it('a purried data-last implementation', () => {
    expect(pipe([1, 2, 3, 4, 5, 6, 7, 8], splice(2, 3, [9, 10]))).toEqual([
      1, 2, 9, 10, 6, 7, 8,
    ]);
  });
});

describe('typing', () => {
  it('reflects the type of `items` in the return value', () => {
    const items: Array<number> = [];
    const result = splice(items, 0, 0, []);
    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  it('reflects the type of `replacement` in the return value', () => {
    const replacement: Array<number> = [];
    const result = splice([], 0, 0, replacement);
    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  it('reflects the type of `replacement` in the return value (data-last)', () => {
    const replacement: Array<number> = [];
    const result = splice(0, 0, replacement);
    expectTypeOf(result).toEqualTypeOf<
      (items: ReadonlyArray<number>) => Array<number>
    >();
  });
});
