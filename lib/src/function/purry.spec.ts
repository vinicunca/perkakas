import { expect, it } from 'vitest';
import { purry } from '../function';

function sub(a: number, b: number) {
  return a - b;
}

it('all arguments', () => {
  function fn(...args: Array<any>) {
    return purry(sub, args);
  }
  expect(fn(10, 5)).toEqual(5);
});

it('1 missing', () => {
  function fn(...args: Array<any>) {
    return purry(sub, args);
  }
  expect(fn(5)(10)).toEqual(5);
});

it('wrong number of arguments', () => {
  function fn(...args: Array<any>) {
    return purry(sub, args);
  }
  expect(() => fn(5, 10, 40)).toThrowError('Wrong number of arguments');
});
