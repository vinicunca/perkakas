import { anyPass } from './any-pass';

const fns = [(x: number) => x === 3, (x: number) => x === 4] as const;

describe('data first', () => {
  it('anyPass', () => {
    expect(anyPass(3, fns)).toEqual(true);
    expect(anyPass(4, fns)).toEqual(true);
    expect(anyPass(1, fns)).toEqual(false);
  });
});

describe('data last', () => {
  it('anyPass', () => {
    expect(anyPass(fns)(3)).toEqual(true);
    expect(anyPass(fns)(4)).toEqual(true);
    expect(anyPass(fns)(1)).toEqual(false);
  });
});
