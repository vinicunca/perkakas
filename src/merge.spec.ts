import { merge } from './merge';

describe('data first', () => {
  it('should merge', () => {
    expect(merge({ x: 1, y: 2 }, { y: 10, z: 2 })).toStrictEqual({
      x: 1,
      y: 10,
      z: 2,
    });
  });
});

describe('data last', () => {
  it('should merge', () => {
    expect(merge({ y: 10, z: 2 })({ x: 1, y: 2 })).toStrictEqual({
      x: 1,
      y: 10,
      z: 2,
    });
  });
});
