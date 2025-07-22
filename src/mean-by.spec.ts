import { describe, expect, it } from 'vitest';
import { identity } from './identity';
import { meanBy } from './mean-by';
import { pipe } from './pipe';
import { prop } from './prop';

describe('data first', () => {
  it('meanBy', () => {
    expect(
      meanBy([{ a: 1 }, { a: 2 }, { a: 4 }, { a: 5 }, { a: 3 }], prop('a')),
    ).toBe(3);
  });

  it('indexed', () => {
    expect(
      meanBy(
        [{ a: 1 }, { a: 2 }, { a: 4 }, { a: 5 }, { a: 3 }],
        ({ a }, idx) => a + idx,
      ),
    ).toBe(5);
  });

  it('should handle empty array', () => {
    expect(meanBy([], identity())).toBeNaN();
  });
});

describe('data last', () => {
  it('meanBy', () => {
    expect(
      pipe(
        [{ a: 1 }, { a: 2 }, { a: 4 }, { a: 5 }, { a: 3 }],
        meanBy(prop('a')),
      ),
    ).toBe(3);
  });

  it('indexed', () => {
    expect(
      pipe(
        [{ a: 1 }, { a: 2 }, { a: 4 }, { a: 5 }, { a: 3 }],
        meanBy(({ a }, idx) => a + idx),
      ),
    ).toBe(5);
  });

  it('should handle empty array', () => {
    expect(pipe([], meanBy(identity()))).toBeNaN();
  });
});
