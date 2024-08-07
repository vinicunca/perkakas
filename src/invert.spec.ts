import { invert } from './invert';
import { pipe } from './pipe';

describe('data first', () => {
  it('empty object', () => {
    expect(invert({})).toEqual({});
  });

  it('no duplicate values', () => {
    expect(invert({ a: 'd', b: 'e', c: 'f' })).toEqual({
      d: 'a',
      e: 'b',
      f: 'c',
    });
  });

  it('duplicate values', () => {
    expect(invert({ a: 'd', b: 'e', c: 'd' })).toEqual({ e: 'b', d: 'c' });
  });

  it('numeric values', () => {
    expect(invert(['a', 'b', 'c'])).toEqual({ a: '0', b: '1', c: '2' });
  });

  it('symbol keys are filtered out', () => {
    expect(invert({ [Symbol('a')]: 4, a: 'hello' })).toEqual({ hello: 'a' });
  });

  it('number keys are converted to strings', () => {
    expect(invert({ 1: 'a', 2: 'b' })).toEqual({ a: '1', b: '2' });
  });

  it('symbol values are fine', () => {
    const mySymbol = Symbol('my');
    expect(invert({ a: mySymbol })).toEqual({ [mySymbol]: 'a' });
  });
});

describe('data last', () => {
  it('empty object', () => {
    expect(pipe({}, invert())).toEqual({});
  });

  it('no duplicate values', () => {
    expect(pipe({ a: 'd', b: 'e', c: 'f' }, invert())).toEqual({
      d: 'a',
      e: 'b',
      f: 'c',
    });
  });

  it('duplicate values', () => {
    expect(pipe({ a: 'd', b: 'e', c: 'd' }, invert())).toEqual({
      e: 'b',
      d: 'c',
    });
  });

  it('numeric values', () => {
    expect(pipe(['a', 'b', 'c'], invert())).toEqual({
      a: '0',
      b: '1',
      c: '2',
    });
  });
});
