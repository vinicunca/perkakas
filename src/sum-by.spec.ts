import { pipe } from './pipe';
import { prop } from './prop';
import { sumBy } from './sum-by';

describe('data first', () => {
  it('sumBy', () => {
    expect(
      sumBy([{ a: 1 }, { a: 2 }, { a: 4 }, { a: 5 }, { a: 3 }], prop('a')),
    ).toEqual(15);
  });

  it('indexed', () => {
    expect(
      sumBy(
        [{ a: 1 }, { a: 2 }, { a: 4 }, { a: 5 }, { a: 3 }],
        ({ a }, idx) => a + idx,
      ),
    ).toEqual(25);
  });
});

describe('data last', () => {
  it('sumBy', () => {
    expect(
      pipe(
        [{ a: 1 }, { a: 2 }, { a: 4 }, { a: 5 }, { a: 3 }],
        sumBy(prop('a')),
      ),
    ).toEqual(15);
  });

  it('indexed', () => {
    const actual = pipe(
      [{ a: 1 }, { a: 2 }, { a: 4 }, { a: 5 }, { a: 3 }],
      sumBy(({ a }, idx) => a + idx),
    );
    expect(actual).toEqual(25);
  });
});
