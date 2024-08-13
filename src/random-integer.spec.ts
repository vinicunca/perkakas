import { randomInteger } from './random-integer';

const ITERATIONS = 1000;

it('from is greater than to', () => {
  expect(() => randomInteger(10, 0)).toThrow(
    new RangeError('randomInt: The range [10,0] contains no integer'),
  );
});

it('from and to are decimals with same whole number', () => {
  expect(() => expect(randomInteger(1.5, 1.6))).toThrow(
    new RangeError('randomInt: The range [1.5,1.6] contains no integer'),
  );
});

it('non-negative integers', () => {
  for (const v of randomInts(0, 10)) {
    expect(v).toBeGreaterThanOrEqual(0);
    expect(v).toBeLessThanOrEqual(10);
  }
});

it('negative integers', () => {
  for (const v of randomInts(-10, -5)) {
    expect(v).toBeGreaterThanOrEqual(-10);
    expect(v).toBeLessThanOrEqual(-5);
  }
});

it('positive decimals', () => {
  for (const v of randomInts(0.1, 10.9)) {
    expect(v).toBeGreaterThanOrEqual(0.1);
    expect(v).toBeLessThanOrEqual(10.9);
  }
});

it('negative decimals', () => {
  for (const v of randomInts(-10.9, -0.1)) {
    expect(v).toBeGreaterThanOrEqual(-10.9);
    expect(v).toBeLessThanOrEqual(-0.1);
  }
});

it('integers with same value', () => {
  for (const v of randomInts(10, 10)) {
    expect(v).toBe(10);
  }
});

function* randomInts(from: number, to: number): Generator<number> {
  for (let i = 0; i < ITERATIONS; i += 1) {
    yield randomInteger(from, to);
  }
}
