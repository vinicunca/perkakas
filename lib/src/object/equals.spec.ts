import { describe, expect, it } from 'vitest';

import { equals } from './equals';

const dateStr = '2017-06-16T21:36:48.362Z';

const tests: any = [
  {
    description: 'scalars',
    tests: [
      {
        description: 'equal numbers',
        equal: true,
        value1: 1,
        value2: 1,
      },
      {
        description: 'not equal numbers',
        equal: false,
        value1: 1,
        value2: 2,
      },
      {
        description: 'number and array are not equal',
        equal: false,
        value1: 1,
        value2: [],
      },
      {
        description: '0 and null are not equal',
        equal: false,
        value1: 0,
        value2: null,
      },
      {
        description: 'equal strings',
        equal: true,
        value1: 'a',
        value2: 'a',
      },
      {
        description: 'not equal strings',
        equal: false,
        value1: 'a',
        value2: 'b',
      },
      {
        description: 'empty string and null are not equal',
        equal: false,
        value1: '',
        value2: null,
      },
      {
        description: 'null is equal to null',
        equal: true,
        value1: null,
        value2: null,
      },
      {
        description: 'equal booleans (true)',
        equal: true,
        value1: true,
        value2: true,
      },
      {
        description: 'equal booleans (false)',
        equal: true,
        value1: false,
        value2: false,
      },
      {
        description: 'not equal booleans',
        equal: false,
        value1: true,
        value2: false,
      },
      {
        description: '1 and true are not equal',
        equal: false,
        value1: 1,
        value2: true,
      },
      {
        description: '0 and false are not equal',
        equal: false,
        value1: 0,
        value2: false,
      },
      {
        description: 'NaN and NaN are equal',
        equal: true,
        value1: Number.NaN,
        value2: Number.NaN,
      },
      {
        description: '0 and -0 are equal',
        equal: true,
        value1: 0,
        value2: -0,
      },
      {
        description: 'Infinity and Infinity are equal',
        equal: true,
        value1: Number.POSITIVE_INFINITY,
        value2: Number.POSITIVE_INFINITY,
      },
      {
        description: 'Infinity and -Infinity are not equal',
        equal: false,
        value1: Number.POSITIVE_INFINITY,
        value2: Number.NEGATIVE_INFINITY,
      },
    ],
  },

  {
    description: 'objects',
    tests: [
      {
        description: 'empty objects are equal',
        equal: true,
        value1: {},
        value2: {},
      },
      {
        description: 'equal objects (same properties "order")',
        equal: true,
        value1: { a: 1, b: '2' },
        value2: { a: 1, b: '2' },
      },
      {
        description: 'equal objects (different properties "order")',
        equal: true,
        value1: { a: 1, b: '2' },
        value2: { a: 1, b: '2' },
      },
      {
        description: 'not equal objects (extra property)',
        equal: false,
        value1: { a: 1, b: '2' },
        value2: { a: 1, b: '2', c: [] },
      },
      {
        description: 'not equal objects (different properties)',
        equal: false,
        value1: { a: 1, b: '2', c: 3 },
        value2: { a: 1, b: '2', d: 3 },
      },
      {
        description: 'not equal objects (different properties)',
        equal: false,
        value1: { a: 1, b: '2', c: 3 },
        value2: { a: 1, b: '2', d: 3 },
      },
      {
        description: 'equal objects (same sub-properties)',
        equal: true,
        value1: { a: [{ b: 'c' }] },
        value2: { a: [{ b: 'c' }] },
      },
      {
        description: 'not equal objects (different sub-property value)',
        equal: false,
        value1: { a: [{ b: 'c' }] },
        value2: { a: [{ b: 'd' }] },
      },
      {
        description: 'not equal objects (different sub-property)',
        equal: false,
        value1: { a: [{ b: 'c' }] },
        value2: { a: [{ c: 'c' }] },
      },
      {
        description: 'empty array and empty object are not equal',
        equal: false,
        value1: {},
        value2: [],
      },
      {
        description: 'object with extra undefined properties are not equal #1',
        equal: false,
        value1: {},
        value2: { foo: undefined },
      },
      {
        description: 'object with extra undefined properties are not equal #2',
        equal: false,
        value1: { foo: undefined },
        value2: {},
      },
      {
        description: 'object with extra undefined properties are not equal #3',
        equal: false,
        value1: { foo: undefined },
        value2: { bar: undefined },
      },
      {
        description: 'nulls are equal',
        equal: true,
        value1: null,
        value2: null,
      },
      {
        description: 'null and undefined are not equal',
        equal: false,
        value1: null,
        value2: undefined,
      },
      {
        description: 'null and empty object are not equal',
        equal: false,
        value1: null,
        value2: {},
      },
      {
        description: 'undefined and empty object are not equal',
        equal: false,
        value1: undefined,
        value2: {},
      },
    ],
  },

  {
    description: 'arrays',
    tests: [
      {
        description: 'two empty arrays are equal',
        equal: true,
        value1: [],
        value2: [],
      },
      {
        description: 'equal arrays',
        equal: true,
        value1: [1, 2, 3],
        value2: [1, 2, 3],
      },
      {
        description: 'not equal arrays (different item)',
        equal: false,
        value1: [1, 2, 3],
        value2: [1, 2, 4],
      },
      {
        description: 'not equal arrays (different length)',
        equal: false,
        value1: [1, 2, 3],
        value2: [1, 2],
      },
      {
        description: 'equal arrays of objects',
        equal: true,
        value1: [{ a: 'a' }, { b: 'b' }],
        value2: [{ a: 'a' }, { b: 'b' }],
      },
      {
        description: 'not equal arrays of objects',
        equal: false,
        value1: [{ a: 'a' }, { b: 'b' }],
        value2: [{ a: 'a' }, { b: 'c' }],
      },
      {
        description: 'pseudo array and equivalent array are not equal',
        equal: false,
        value1: { 0: 0, 1: 1, length: 2 },
        value2: [0, 1],
      },
    ],
  },
  {
    description: 'Date objects',
    tests: [
      {
        description: 'equal date objects',
        equal: true,
        value1: new Date(dateStr),
        value2: new Date(dateStr),
      },
      {
        description: 'not equal date objects',
        equal: false,
        value1: new Date(dateStr),
        value2: new Date('2017-01-01T00:00:00.000Z'),
      },
      {
        description: 'date and string are not equal',
        equal: false,
        value1: new Date(dateStr),
        value2: dateStr,
      },
      {
        description: 'date and object are not equal',
        equal: false,
        value1: new Date(dateStr),
        value2: {},
      },
    ],
  },
  {
    description: 'RegExp objects',
    tests: [
      {
        description: 'equal RegExp objects',
        equal: true,
        value1: /foo/,
        value2: /foo/,
      },
      {
        description: 'not equal RegExp objects (different pattern)',
        equal: false,
        value1: /foo/,
        value2: /bar/,
      },
      {
        description: 'not equal RegExp objects (different flags)',
        equal: false,
        value1: /foo/,
        value2: /foo/i,
      },
      {
        description: 'RegExp and string are not equal',
        equal: false,
        value1: /foo/,
        value2: 'foo',
      },
      {
        description: 'RegExp and object are not equal',
        equal: false,
        value1: /foo/,
        value2: {},
      },
    ],
  },
  {
    description: 'functions',
    tests: [
      {
        description: 'same function is equal',
        equal: true,
        value1: func1,
        value2: func1,
      },
      {
        description: 'different functions are not equal',
        equal: false,
        value1: func1,
        value2: func2,
      },
    ],
  },
  {
    description: 'sample objects',
    tests: [
      {
        description: 'big object',
        equal: true,
        value1: {
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
        value2: {
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
      },
    ],
  },
];

function func1() {
  //
}
function func2() {
  //
}

describe('equal', () => {
  tests.forEach((suite: any) => {
    describe(suite.description, () => {
      suite.tests.forEach((test: any) => {
        it(test.description, () => {
          expect(equals(test.value1, test.value2)).toEqual(test.equal);
        });
      });
    });
  });
});
