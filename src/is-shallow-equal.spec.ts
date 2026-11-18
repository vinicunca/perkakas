import { describe, expect, it } from 'vitest';
import { isShallowEqual } from './is-shallow-equal';
import { pipe } from './pipe';

describe('primitives', () => {
  it('undefined', () => {
    expect(isShallowEqual(undefined, undefined)).toBe(true);
  });

  it('null', () => {
    expect(isShallowEqual(null, null)).toBe(true);
  });

  it('string', () => {
    expect(isShallowEqual('a', 'a')).toBe(true);
    expect(isShallowEqual('a', 'b')).toBe(false);
  });

  it('number', () => {
    expect(isShallowEqual(1, 1)).toBe(true);
    expect(isShallowEqual(1, 2)).toBe(false);
  });

  it('boolean', () => {
    expect(isShallowEqual(true, true)).toBe(true);
    expect(isShallowEqual(true, false)).toBe(false);
  });

  it('bigint', () => {
    expect(isShallowEqual(1n, 1n)).toBe(true);
    expect(isShallowEqual(1n, 2n)).toBe(false);
  });
});

describe('objects', () => {
  it('arrays', () => {
    const data = [1, 2, 3];

    expect(isShallowEqual(data, [1, 2, 3])).toBe(true);
    expect(isShallowEqual(data, data)).toBe(true);

    expect(isShallowEqual(data, [1, 2])).toBe(false);
  });

  it('objects', () => {
    const data = { a: 1, b: 2 } as Record<string, number>;

    expect(isShallowEqual(data, { a: 1, b: 2 })).toBe(true);
    expect(isShallowEqual(data, data)).toBe(true);

    expect(isShallowEqual(data, { a: 1 })).toBe(false);
    expect(isShallowEqual(data, { a: 1, c: 3 })).toBe(false);
  });

  it('objects with different keys holding undefined', () => {
    expect(isShallowEqual({ a: undefined }, { b: undefined })).toBe(false);
  });

  it('uint arrays', () => {
    const data = new Uint8Array([1, 2, 3]);

    expect(isShallowEqual(data, new Uint8Array([1, 2, 3]))).toBe(true);
    expect(isShallowEqual(data, data)).toBe(true);

    expect(isShallowEqual(data, new Uint8Array([1, 2]))).toBe(false);
  });

  it('maps', () => {
    const data = new Map([
      ['a', 1],
    ]);

    expect(isShallowEqual(data, new Map([
      ['a', 1],
    ]))).toBe(true);
    expect(isShallowEqual(data, data)).toBe(true);

    expect(isShallowEqual(data, new Map([
      ['a', 2],
    ]))).toBe(false);
    expect(
      isShallowEqual(
        data,
        new Map([
          ['a', 1],
          ['b', 2],
        ]),
      ),
    ).toBe(false);
  });

  it('maps with different keys holding undefined', () => {
    expect(
      isShallowEqual(new Map([
        ['a', undefined],
      ]), new Map([
        ['b', undefined],
      ])),
    ).toBe(false);
  });

  it('maps with the same key holding undefined', () => {
    expect(
      isShallowEqual(new Map([
        ['a', undefined],
      ]), new Map([
        ['a', undefined],
      ])),
    ).toBe(true);
  });

  it('sets', () => {
    const data = new Set([1, 2, 3]);

    expect(isShallowEqual(data, new Set([1, 2, 3]))).toBe(true);
    expect(isShallowEqual(data, data)).toBe(true);

    expect(isShallowEqual(data, new Set([1, 2]))).toBe(false);
    expect(isShallowEqual(data, new Set([4, 5, 6]))).toBe(false);
  });
});

describe('built-ins', () => {
  it('regex', () => {
    const data = /a/u;

    expect(isShallowEqual(data, /a/u)).toBe(true);
    expect(isShallowEqual(data, data)).toBe(true);

    expect(isShallowEqual(data, /b/u)).toBe(true);
  });

  it('dates', () => {
    const data = new Date();

    expect(isShallowEqual(data, new Date())).toBe(true);
    expect(isShallowEqual(data, data)).toBe(true);

    expect(isShallowEqual(data, new Date(data.getTime() + 1))).toBe(true);
  });

  it('promises', () => {
    const data = Promise.resolve(1);

    expect(isShallowEqual(data, Promise.resolve(1))).toBe(true);
    expect(isShallowEqual(data, data)).toBe(true);

    expect(isShallowEqual(data, Promise.resolve(2))).toBe(true);
  });
});

describe('shallow inequality', () => {
  it('arrays of objects', () => {
    const a = { a: 1 };

    expect(isShallowEqual([a], [a])).toBe(true);
    expect(isShallowEqual([a], [
      { a: 1 },
    ])).toBe(false);
  });

  it('arrays of arrays', () => {
    const a = [1];

    expect(isShallowEqual([a], [a])).toBe(true);
    expect(isShallowEqual([a], [
      [1],
    ])).toBe(false);
  });

  it('objects of arrays', () => {
    const a = [1];

    expect(isShallowEqual({ a }, { a })).toBe(true);
    expect(isShallowEqual({ a }, {
      a: [1],
    })).toBe(false);
  });

  it('objects of objects', () => {
    const a = { b: 1 };

    expect(isShallowEqual({ a }, { a })).toBe(true);
    expect(isShallowEqual({ a }, {
      a: { b: 1 },
    })).toBe(false);
  });
});

describe('data-last', () => {
  it('equal', () => {
    expect(pipe({ a: 1 }, isShallowEqual({ a: 1 }))).toBe(true);
  });

  it('not equal', () => {
    expect(pipe({ a: 1 }, isShallowEqual({ a: 2 }))).toBe(false);
  });
});

describe('known issues!', () => {
  it('a Set equals an empty array typed as the same iterable', () => {
    const isEqual = isShallowEqual(new Set([1]) as Iterable<number>, []);

    // Entries are compared only between two Maps or two Sets; any other pair
    // compares own enumerable keys, and a Map or Set has none.
    expect(isEqual).not.toBe(false);

    // Actual
    expect(isEqual).toBe(true);
  });

  it('a non-enumerable own property stands in for a missing key', () => {
    const isEqual = isShallowEqual({ length: 1 }, ['x']);

    // Keys are counted with `Object.keys`, which skips non-enumerable
    // properties, but matched with `Object.hasOwn`, which doesn't, so the
    // array's hidden `length` matches while its `0` key is never checked.
    expect(isEqual).not.toBe(false);

    // Actual
    expect(isEqual).toBe(true);
  });
});
