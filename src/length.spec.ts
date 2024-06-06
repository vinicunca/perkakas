import { length } from './length';
import { pipe } from './pipe';

describe('data first', () => {
  it('array', () => {
    expect(length([0, 1, 2, 3, 4])).toEqual(5);
  });

  it('iterable', () => {
    expect(
      length({
        *[Symbol.iterator]() {
          yield 0;
          yield 1;
          yield 2;
          yield 3;
        },
      }),
    ).toEqual(4);
  });
});

describe('curried', () => {
  it('array', () => {
    expect(pipe([0, 1, 2, 3, 4], length())).toEqual(5);
  });

  it('iterable', () => {
    expect(
      pipe(
        {
          *[Symbol.iterator]() {
            yield 0;
            yield 1;
            yield 2;
            yield 3;
          },
        },
        length(),
      ),
    ).toEqual(4);
  });
});
