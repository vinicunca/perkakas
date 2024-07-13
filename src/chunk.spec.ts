import { chunk } from './chunk';

describe('data first', () => {
  it('equal size', () => {
    expect(chunk(['a', 'b', 'c', 'd'] as const, 2)).toEqual([
      ['a', 'b'],
      ['c', 'd'],
    ]);
  });

  it('not equal size', () => {
    expect(chunk(['a', 'b', 'c', 'd'] as const, 3)).toEqual([
      ['a', 'b', 'c'],
      ['d'],
    ]);
  });

  it('1 element', () => {
    expect(chunk(['x'] as const, 3)).toEqual([['x']]);
  });

  it('empty array', () => {
    expect(chunk([] as const, 3)).toEqual([]);
  });
});

describe('data last', () => {
  it('equal size', () => {
    expect(chunk(2)(['a', 'b', 'c', 'd'] as const)).toEqual([
      ['a', 'b'],
      ['c', 'd'],
    ]);
  });
});
