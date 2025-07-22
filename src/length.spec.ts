import { describe, expect, it } from 'vitest';
import { length } from './length';
import { pipe } from './pipe';

describe('data first', () => {
  it('array', () => {
    expect(length([0, 1, 2, 3, 4])).toBe(5);
  });

  it('iterable', () => {
    expect(
      length({
        * [Symbol.iterator]() {
          yield 0;
          yield 1;
          yield 2;
          yield 3;
        },
      }),
    ).toBe(4);
  });
});

describe('curried', () => {
  it('array', () => {
    expect(pipe([0, 1, 2, 3, 4], length())).toBe(5);
  });

  it('iterable', () => {
    expect(
      pipe(
        {
          * [Symbol.iterator]() {
            yield 0;
            yield 1;
            yield 2;
            yield 3;
          },
        },
        length(),
      ),
    ).toBe(4);
  });
});
