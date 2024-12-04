import { addProp } from './add-prop';
import { pipe } from './pipe';

describe('data first', () => {
  it('simple', () => {
    const actual = addProp({ a: 1 }, 'b', 2);

    expect(actual).toStrictEqual({ a: 1, b: 2 });
  });
});

describe('data last', () => {
  it('simple', () => {
    const actual = pipe({ a: 1 }, addProp('b', 2));

    expect(actual).toStrictEqual({ a: 1, b: 2 });
  });
});
