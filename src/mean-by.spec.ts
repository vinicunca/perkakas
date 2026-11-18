import { describe, expect, it, vi } from 'vitest';
import { identity } from './identity';
import { meanBy } from './mean-by';
import { pipe } from './pipe';
import { prop } from './prop';

describe('data first', () => {
  it('meanBy', () => {
    expect(
      meanBy([
        { a: 1 },
        { a: 2 },
        { a: 4 },
        { a: 5 },
        { a: 3 },
      ], prop('a')),
    ).toBe(3);
  });

  it('indexed', () => {
    expect(
      meanBy(
        [
          { a: 1 },
          { a: 2 },
          { a: 4 },
          { a: 5 },
          { a: 3 },
        ],
        ({ a }, idx) => a + idx,
      ),
    ).toBe(5);
  });

  it('should handle empty array', () => {
    expect(meanBy([], identity())).toBeNaN();
  });

  it('doesn\'t call the mapper on an empty array', () => {
    const mapper = vi.fn<(value: number) => number>(identity());

    meanBy([], mapper);

    expect(mapper).not.toHaveBeenCalled();
  });

  it('a single item', () => {
    expect(meanBy([
      { a: 5 },
    ], prop('a'))).toBe(5);
  });

  it('the 0 seed turns -0 into 0', () => {
    expect(meanBy([-0], identity())).toBe(0);
  });

  it('propagates NaN', () => {
    expect(meanBy([1, NaN, 3], identity())).toBeNaN();
  });

  it('calls the mapper on each item in order with the whole array', () => {
    const data = [1, 2, 3];
    const mapper
      = vi.fn<(value: number, index: number, data: ReadonlyArray<number>) => number>(
        identity(),
      );

    meanBy(data, mapper);

    expect(mapper.mock.calls).toStrictEqual([
      [1, 0, data],
      [2, 1, data],
      [3, 2, data],
    ]);
  });
});

describe('data last', () => {
  it('meanBy', () => {
    expect(
      pipe(
        [
          { a: 1 },
          { a: 2 },
          { a: 4 },
          { a: 5 },
          { a: 3 },
        ],
        meanBy(prop('a')),
      ),
    ).toBe(3);
  });

  it('indexed', () => {
    expect(
      pipe(
        [
          { a: 1 },
          { a: 2 },
          { a: 4 },
          { a: 5 },
          { a: 3 },
        ],
        meanBy(({ a }, idx) => a + idx),
      ),
    ).toBe(5);
  });

  it('should handle empty array', () => {
    expect(pipe([], meanBy(identity()))).toBeNaN();
  });
});
