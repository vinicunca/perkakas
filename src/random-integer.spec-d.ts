import { expectTypeOf, it } from 'vitest';
import { randomInteger } from './random-integer';

it('returns number when from is float', () => {
  expectTypeOf(randomInteger(0.5, 1)).toEqualTypeOf<number>();
});

it('returns number when to is float', () => {
  expectTypeOf(randomInteger(1, 1.5)).toEqualTypeOf<number>();
});

it('returns never when from is greater than to', () => {
  expectTypeOf(randomInteger(10, 1)).toEqualTypeOf<never>();
});

it('returns the range as union for valid range (0-999)', () => {
  expectTypeOf(randomInteger(0, 5)).toEqualTypeOf<0 | 1 | 2 | 3 | 4 | 5>();
  expectTypeOf(randomInteger(998, 999)).toEqualTypeOf<998 | 999>();
});

it('returns the same value when to equals from', () => {
  expectTypeOf(randomInteger(1, 1)).toEqualTypeOf<1>();
});

it('returns the same value when to equals from and out of range', () => {
  expectTypeOf(randomInteger(10_000, 10_000)).toEqualTypeOf<10_000>();
});

it('Returns number for large max (to >= 1000)', () => {
  expectTypeOf(randomInteger(1, 1001)).toEqualTypeOf<number>();
});

it('Returns number when from is a negative integer', () => {
  expectTypeOf(randomInteger(-1, 1)).toEqualTypeOf<number>();
});

it('Returns number when to is a negative integer', () => {
  expectTypeOf(randomInteger(1, -1)).toEqualTypeOf<number>();
});

it('Returns number when from is a negative decimal', () => {
  expectTypeOf(randomInteger(-1.5, 1)).toEqualTypeOf<number>();
});

it('Returns number when to is a negative decimal', () => {
  expectTypeOf(randomInteger(1, -1.5)).toEqualTypeOf<number>();
});

it('Returns number when from is number', () => {
  expectTypeOf(randomInteger(1 as number, 5)).toEqualTypeOf<number>();
});

it('Returns number when to is number', () => {
  expectTypeOf(randomInteger(1, 5 as number)).toEqualTypeOf<number>();
});

it('Returns number when from and to are number', () => {
  expectTypeOf(randomInteger(1 as number, 5 as number)).toEqualTypeOf<number>();
});

it('Returns number when from and to are very big numbers', () => {
  expectTypeOf(
    randomInteger(10_000_000_000, 10_000_000_001),
  ).toEqualTypeOf<number>();
});
