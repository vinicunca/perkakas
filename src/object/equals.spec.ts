import { describe, expect, it } from 'vitest';

import { equals } from './equals';

function func1(): void {
  // (intentionally empty)
}
function func2(): void {
  // (intentionally empty)
}

describe('scalars', () => {
  it('equal numbers', () => {
    expect(equals(1, 1)).toBe(true);
  });
  it('not equal numbers', () => {
    expect(equals(1, 2)).toBe(false);
  });
  it('number and array are not equal', () => {
    expect(equals(1, [])).toBe(false);
  });
  it('0 and null are not equal', () => {
    expect(equals(0, null)).toBe(false);
  });
  it('equal strings', () => {
    expect(equals('a', 'a')).toBe(true);
  });
  it('not equal strings', () => {
    expect(equals('a', 'b')).toBe(false);
  });
  it('empty string and null are not equal', () => {
    expect(equals('', null)).toBe(false);
  });
  it('null is equal to null', () => {
    expect(equals(null, null)).toBe(true);
  });
  it('equal booleans (true)', () => {
    expect(equals(true, true)).toBe(true);
  });
  it('equal booleans (false)', () => {
    expect(equals(false, false)).toBe(true);
  });
  it('not equal booleans', () => {
    expect(equals(true, false)).toBe(false);
  });
  it('1 and true are not equal', () => {
    expect(equals(1, true)).toBe(false);
  });
  it('0 and false are not equal', () => {
    expect(equals(0, false)).toBe(false);
  });
  it('naN and NaN are equal', () => {
    expect(equals(Number.NaN, Number.NaN)).toBe(true);
  });
  it('0 and -0 are equal', () => {
    expect(equals(0, -0)).toBe(true);
  });
  it('infinity and Infinity are equal', () => {
    expect(equals(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY)).toBe(
      true,
    );
  });
  it('infinity and -Infinity are not equal', () => {
    expect(equals(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY)).toBe(
      false,
    );
  });
});

describe('objects', () => {
  it('empty objects are equal', () => {
    expect(equals({}, {})).toBe(true);
  });
  it('equal objects (same properties "order")', () => {
    expect(equals({ a: 1, b: '2' }, { a: 1, b: '2' })).toBe(true);
  });
  it('equal objects (different properties "order")', () => {
    expect(equals({ a: 1, b: '2' }, { a: 1, b: '2' })).toBe(true);
  });
  it('not equal objects (extra property)', () => {
    expect(equals({ a: 1, b: '2' }, { a: 1, b: '2', c: [] })).toBe(false);
  });
  it('not equal objects (different properties) #1', () => {
    expect(equals({ a: 1, b: '2', c: 3 }, { a: 1, b: '2', d: 3 })).toBe(false);
  });
  it('not equal objects (different properties) #2', () => {
    expect(equals({ a: 1, b: '2', c: 3 }, { a: 1, b: '2', d: 3 })).toBe(false);
  });
  it('equal objects (same sub-properties)', () => {
    expect(equals({ a: [{ b: 'c' }] }, { a: [{ b: 'c' }] })).toBe(true);
  });
  it('not equal objects (different sub-property value)', () => {
    expect(equals({ a: [{ b: 'c' }] }, { a: [{ b: 'd' }] })).toBe(false);
  });
  it('not equal objects (different sub-property)', () => {
    expect(equals({ a: [{ b: 'c' }] }, { a: [{ c: 'c' }] })).toBe(false);
  });
  it('empty array and empty object are not equal', () => {
    expect(equals({}, [])).toBe(false);
  });
  it('object with extra undefined properties are not equal #1', () => {
    expect(equals({}, { foo: undefined })).toBe(false);
  });
  it('object with extra undefined properties are not equal #2', () => {
    expect(equals({ foo: undefined }, {})).toBe(false);
  });
  it('object with extra undefined properties are not equal #3', () => {
    expect(equals({ foo: undefined }, { bar: undefined })).toBe(false);
  });
  it('nulls are equal', () => {
    expect(equals(null, null)).toBe(true);
  });
  it('null and undefined are not equal', () => {
    expect(equals(null, undefined)).toBe(false);
  });
  it('null and empty object are not equal', () => {
    expect(equals(null, {})).toBe(false);
  });
  it('undefined and empty object are not equal', () => {
    expect(equals(undefined, {})).toBe(false);
  });
});

describe('arrays', () => {
  it('two empty arrays are equal', () => {
    expect(equals([], [])).toBe(true);
  });
  it('equal arrays', () => {
    expect(equals([1, 2, 3], [1, 2, 3])).toBe(true);
  });
  it('not equal arrays (different item)', () => {
    expect(equals([1, 2, 3], [1, 2, 4])).toBe(false);
  });
  it('not equal arrays (different length)', () => {
    expect(equals([1, 2, 3], [1, 2])).toBe(false);
  });
  it('equal arrays of objects', () => {
    expect(equals([{ a: 'a' }, { b: 'b' }], [{ a: 'a' }, { b: 'b' }])).toBe(
      true,
    );
  });
  it('not equal arrays of objects', () => {
    expect(equals([{ a: 'a' }, { b: 'b' }], [{ a: 'a' }, { b: 'c' }])).toBe(
      false,
    );
  });
  it('pseudo array and equivalent array are not equal', () => {
    expect(equals({ 0: 0, 1: 1, length: 2 }, [0, 1])).toBe(false);
  });
});

describe('date objects', () => {
  it('equal date objects', () => {
    expect(
      equals(
        new Date('2017-06-16T21:36:48.362Z'),
        new Date('2017-06-16T21:36:48.362Z'),
      ),
    ).toBe(true);
  });
  it('not equal date objects', () => {
    expect(
      equals(
        new Date('2017-06-16T21:36:48.362Z'),
        new Date('2017-01-01T00:00:00.000Z'),
      ),
    ).toBe(false);
  });
  it('date and string are not equal', () => {
    expect(
      equals(new Date('2017-06-16T21:36:48.362Z'), '2017-06-16T21:36:48.362Z'),
    ).toBe(false);
  });
  it('date and object are not equal', () => {
    expect(equals(new Date('2017-06-16T21:36:48.362Z'), {})).toBe(false);
  });
});

describe('regExp objects', () => {
  it('equal RegExp objects', () => {
    expect(equals(/foo/u, /foo/u)).toBe(true);
  });
  it('not equal RegExp objects (different pattern)', () => {
    expect(equals(/foo/u, /bar/u)).toBe(false);
  });
  it('not equal RegExp objects (different flags)', () => {
    expect(equals(/foo/u, /foo/iu)).toBe(false);
  });
  it('regExp and string are not equal', () => {
    expect(equals(/foo/u, 'foo')).toBe(false);
  });
  it('regExp and object are not equal', () => {
    expect(equals(/foo/u, {})).toBe(false);
  });
});

describe('functions', () => {
  it('same function is equal', () => {
    expect(equals(func1, func1)).toBe(true);
  });
  it('different functions are not equal', () => {
    expect(equals(func1, func2)).toBe(false);
  });
});

describe('sample objects', () => {
  it('big object', () => {
    expect(
      equals(
        {
          prop1: 'value1',
          prop2: 'value2',
          prop3: 'value3',
          prop4: {
            subProp1: 'sub value1',
            subProp2: {
              subSubProp1: 'sub sub value1',
              subSubProp2: [1, 2, { prop: 2, prop2: 1 }, 4, 5],
            },
          },
          prop5: 1000,
          prop6: new Date(2016, 2, 10),
        },
        {
          prop1: 'value1',
          prop2: 'value2',
          prop3: 'value3',
          prop4: {
            subProp1: 'sub value1',
            subProp2: {
              subSubProp1: 'sub sub value1',
              subSubProp2: [1, 2, { prop: 2, prop2: 1 }, 4, 5],
            },
          },
          prop5: 1000,
          prop6: new Date('2016/03/10'),
        },
      ),
    ).toBe(true);
  });
});
