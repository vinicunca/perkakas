import { describe, expect, it } from 'vitest';
import { fromEntries } from './from-entries';
import { pipe } from './pipe';

it('dataFirst', () => {
  expect(
    fromEntries([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]),
  ).toStrictEqual({ a: 1, b: 2, c: 3 });
});

it('dataLast', () => {
  expect(
    pipe(
      [
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ] as const,
      fromEntries(),
    ),
  ).toStrictEqual({ a: 1, b: 2, c: 3 });
});

it('empty array', () => {
  expect(fromEntries([])).toStrictEqual({});
});

it('single entry', () => {
  expect(fromEntries([
    ['a', 1],
  ])).toStrictEqual({ a: 1 });
});

it('boolean values', () => {
  expect(
    fromEntries([
      ['hello', true],
      ['world', false],
    ]),
  ).toStrictEqual({ hello: true, world: false });
});

it('string values', () => {
  expect(fromEntries([
    ['a', 'd'],
  ])).toStrictEqual({ a: 'd' });
});

it('number keys and values', () => {
  expect(fromEntries([
    [1, 123],
  ])).toStrictEqual({ 1: 123 });
});

it('values are stored by reference', () => {
  const value = { a: 1 };

  expect(fromEntries([['a', value]] as const).a).toBe(value);
});

it('prototype is Object.prototype', () => {
  expect(Object.getPrototypeOf(fromEntries([
    ['a', 1],
  ]))).toBe(Object.prototype);
});

it('`__proto__` key is an own property', () => {
  expect(Object.entries(fromEntries([
    ['__proto__', 1],
  ]))).toStrictEqual([
    ['__proto__', 1],
  ]);
});

it('`__proto__` key keeps the prototype', () => {
  expect(Object.getPrototypeOf(fromEntries([
    [
      '__proto__',
      { a: 1 },
    ],
  ]))).toBe(
    Object.prototype,
  );
});

it('duplicate keys keep the first position and the last value', () => {
  expect(
    Object.entries(
      fromEntries([
        ['a', 1],
        ['b', 2],
        ['a', 3],
      ]),
    ),
  ).toStrictEqual([
    ['a', 3],
    ['b', 2],
  ]);
});

it('number and string keys for the same property collapse', () => {
  expect(
    fromEntries([
      [1, 'number'],
      ['1', 'string'],
    ]),
  ).toStrictEqual({ 1: 'string' });
});

it('symbol keys', () => {
  const mySymbol = Symbol('mySymbol');

  expect(fromEntries([
    [mySymbol, 1],
  ])).toStrictEqual({ [mySymbol]: 1 });
});

it('key order', () => {
  const mySymbol = Symbol('mySymbol');

  expect(
    Reflect.ownKeys(
      fromEntries([
        ['b', 1],
        ['10', 2],
        [mySymbol, 3],
        ['a', 4],
        ['2', 5],
        ['b', 6],
      ]),
    ),
  ).toStrictEqual(['2', '10', 'b', 'a', mySymbol]);
});

it('reads the key at index 0 and then the value at index 1', () => {
  const accessed: Array<PropertyKey> = [];
  const entry = new Proxy(['a', 1] as const, {
    get: (target, property, receiver): unknown => {
      accessed.push(property);
      return Reflect.get(target, property, receiver);
    },
  });

  fromEntries([entry]);

  expect(accessed).toStrictEqual(['0', '1']);
});

it('empty array in a pipe', () => {
  expect(pipe([], fromEntries())).toStrictEqual({});
});

it('prototype is Object.prototype in a pipe', () => {
  expect(Object.getPrototypeOf(pipe([
    ['a', 1],
  ] as const, fromEntries()))).toBe(
    Object.prototype,
  );
});

describe('known issues!', () => {
  it('a key inherited as read-only (e.g., from a frozen `Object.prototype`) throws instead of becoming an own property', () => {
    // Assignment can't shadow an inherited read-only property, while
    // `Object.fromEntries` defines each property directly. Sloppy-mode code
    // (the CJS build) drops the key silently instead of throwing.
    // Freezing the real `Object.prototype` would leak into every later test;
    // one read-only member is the same lookup, and is removed afterwards.
    // eslint-disable-next-line no-extend-native -- The inherited member is the input under test; the `finally` below removes it.
    Object.defineProperty(Object.prototype, 'readOnlyMember', {
      value: 'inherited',
      configurable: true,
    });

    try {
      expect(() => fromEntries([['readOnlyMember', 1]])).toThrow(TypeError);
    } finally {
      Reflect.deleteProperty(Object.prototype, 'readOnlyMember');
    }
  });
});
