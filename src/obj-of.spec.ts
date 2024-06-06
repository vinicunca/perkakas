import { objOf } from './obj-of';

describe('data first', () => {
  it('wrap value', () => {
    const actual = objOf(10, 'a');
    expect(actual.a).toEqual(10);
    expect(actual).toEqual({ a: 10 });
  });
});

describe('data last', () => {
  it('wrap value', () => {
    const actual = objOf('a')(10);
    expect(actual.a).toEqual(10);
    expect(actual).toEqual({ a: 10 });
  });
});
