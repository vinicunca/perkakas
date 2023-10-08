import { describe, expect, it } from 'vitest';

/* eslint-disable no-restricted-syntax */

import {
  isUppercase,
  splitByCase,
  toCamelCase,
  toKebabCase,
  toLowerFirst,
  toPascalCase,
  toSnakeCase,
  toUpperFirst,
} from './cases';

const UNDEFINED_INPUT = 'undefined input';

describe('split by case', () => {
  const tests: any = {
    '': [],
    'foo': ['foo'],
    'fooBar': ['foo', 'Bar'],
    'FooBarBaz': ['Foo', 'Bar', 'Baz'],
    'foo_bar-baz/qux': ['foo', 'bar', 'baz', 'qux'],
    'foo--bar-Baz': ['foo', '', 'bar', 'Baz'],
    'FOOBar': ['FOO', 'Bar'],
    'ALink': ['A', 'Link'],
  };

  for (const input in tests) {
    it(`${input} => ${tests[input].join(', ')}`, () => {
      expect(splitByCase(input)).toMatchObject(tests[input]);
    });
  }
});

describe('pascal case', () => {
  const tests: any = {
    'foo': 'Foo',
    'foo-bAr': 'FooBAr',
    'FooBARb': 'FooBARb',
    'foo_bar-baz/qux': 'FooBarBazQux',
    'foo--bar': 'FooBar',
  };

  for (const input in tests) {
    it(`${input} => ${tests[input]}`, () => {
      expect(toPascalCase(input)).toBe(tests[input]);
    });
  }

  it(UNDEFINED_INPUT, () => {
    expect(toPascalCase(undefined)).toBe('');
  });
});

describe('camel case', () => {
  const tests: any = {
    FooBarBaz: 'fooBarBaz',
  };

  for (const input in tests) {
    it(`${input} => ${tests[input]}`, () => {
      expect(toCamelCase(input)).toBe(tests[input]);
    });
  }

  it(UNDEFINED_INPUT, () => {
    expect(toCamelCase(undefined)).toBe('');
  });
});

describe('kebab case', () => {
  const tests: any = {
    'foo': 'foo',
    'foo/Bar': 'foo-bar',
    'foo-bAr': 'foo-b-ar',
    'foo--bar': 'foo--bar',
    'FooBAR': 'foo-bar',
    'ALink': 'a-link',
  };

  for (const input in tests) {
    it(`${input} => ${tests[input]}`, () => {
      expect(toKebabCase(input)).toBe(tests[input]);
    });
  }

  it(UNDEFINED_INPUT, () => {
    expect(toKebabCase(undefined)).toBe('');
  });
});

describe('snake case', () => {
  const tests: any = {
    FooBarBaz: 'foo_bar_baz',
  };

  for (const input in tests) {
    it(`${input} => ${tests[input]}`, () => {
      expect(toSnakeCase(input)).toBe(tests[input]);
    });
  }

  it(UNDEFINED_INPUT, () => {
    expect(toSnakeCase(undefined)).toBe('');
  });
});

describe('upper first', () => {
  const tests: any = {
    '': '',
    'foo': 'Foo',
    'Foo': 'Foo',
  };

  for (const input in tests) {
    it(`${input} => ${tests[input]}`, () => {
      expect(toUpperFirst(input)).toBe(tests[input]);
    });
  }
});

describe('lower first', () => {
  const tests: any = {
    '': '',
    'foo': 'foo',
    'Foo': 'foo',
  };

  for (const input in tests) {
    it(`${input} => ${tests[input]}`, () => {
      expect(toLowerFirst(input)).toBe(tests[input]);
    });
  }
});

describe('is uppercase', () => {
  it('base', () => {
    expect(isUppercase('a')).toBe(false);
  });

  it(UNDEFINED_INPUT, () => {
    expect(isUppercase(undefined)).toBe(true);
  });
});
