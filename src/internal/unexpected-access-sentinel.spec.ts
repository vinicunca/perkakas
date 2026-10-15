import { inspect } from 'node:util';
import { describe, expect, it } from 'vitest';
import { isDeepEqual } from '../is-deep-equal';
import { UNEXPECTED_ACCESS_SENTINEL } from './unexpected-access-sentinel';

// Typed the way the callbacks that receive it see it.
const DATA: ReadonlyArray<number> = UNEXPECTED_ACCESS_SENTINEL;

describe('throws', () => {
  it.each([
    ['index access', () => DATA[0]],
    ['length', () => DATA.length],
    ['`map`', () => DATA.map((value) => value)],
    ['`at`', () => DATA.at(0)],
    ['iteration', () => [...DATA]],
    ['string coercion', () => String(DATA)],
    ['serialization', () => JSON.stringify(DATA)],

    ['`concat` spreading it', () => [1].concat(DATA)],
    ['`flat` spreading it', () => [DATA].flat()],
    ['deep equality', () => isDeepEqual(DATA, [])],
    ['`in` with an index', () => 0 in DATA],
    ['`in` with an array method', () => 'map' in DATA],
    ['key enumeration', () => Object.keys(DATA)],
    ['own index lookup', () => Object.hasOwn(DATA, 0)],
    ['assignment', () => Reflect.set(DATA, 0, 1)],
    [
      'property definition',
      () => Reflect.defineProperty(DATA, 'key', { value: 1 }),
    ],
    ['deletion', () => Reflect.deleteProperty(DATA, 'key')],
    ['preventing extensions', () => Reflect.preventExtensions(DATA)],
    [
      'prototype replacement',
      () => Reflect.setPrototypeOf(DATA, Array.prototype),
    ],
  ])('throws on %s', (_name, operation) => {
    expect(operation).toThrow(/^Perkakas: /u);
  });
});

describe('allows through', () => {
  it('accessing a specific prop', () => {
    expect(Reflect.get(DATA, 'key')).toBeUndefined();
  });

  it('checking a specific prop exists (in)', () => {
    expect('key' in DATA).toBe(false);
  });

  it('checking a specific prop exists (hasOwn)', () => {
    expect(Object.hasOwn(DATA, 'key')).toBe(false);
  });
});

describe('looks like an array', () => {
  it('inherits from `Array.prototype`', () => {
    expect(Object.getPrototypeOf(DATA)).toBe(Array.prototype);
  });

  it('is an array', () => {
    expect(Array.isArray(DATA)).toBe(true);
  });

  it('is tagged as an array', () => {
    expect(Object.prototype.toString.call(DATA)).toBe('[object Array]');
  });
});

it('renders the error message when viewed by debuggers', () => {
  expect(inspect(DATA)).toContain('Perkakas: ');
});
