import { describe, expect, it } from 'vitest';
import {
  toCamelCase,
  toFlatCase,
  toKebabCase,
  toLowerFirst,
  toPascalCase,
  toSnakeCase,
  splitByCase,
  toTitleCase,
  toTrainCase,
  toUpperFirst,
} from './string-case';

describe('splitByCase', () => {
  it.each([
    ['', []],
    ['foo', ['foo']],
    ['fooBar', ['foo', 'Bar']],
    ['FooBarBaz', ['Foo', 'Bar', 'Baz']],
    ['FooBARb', ['Foo', 'BA', 'Rb']],
    ['foo_bar-baz/qux', ['foo', 'bar', 'baz', 'qux']],
    ['foo--bar-Baz', ['foo', '', 'bar', 'Baz']],
    ['FOO_BAR', ['FOO', 'BAR']],
    ['foo123-bar', ['foo123', 'bar']],
    ['FOOBar', ['FOO', 'Bar']],
    ['ALink', ['A', 'Link']],
    // with custom splitters
    [
      'foo\\Bar.fuzz-FIZz',
      ['foo', 'Bar', 'fuzz', 'FI', 'Zz'],
      ['\\', '.', '-'],
    ],
    ['new-name-value', ['new-name-value'], ['_']],
  ])('%s => %s', (input, expected, customSplitters?) => {
    if (customSplitters) {
      expect(splitByCase(input, customSplitters)).toMatchObject(expected);
    } else {
      expect(splitByCase(input)).toMatchObject(expected);
    }
  });
});

describe('pascalCase', () => {
  it.each([
    ['', ''],
    ['foo', 'Foo'],
    ['foo-bAr', 'FooBAr'],
    ['FooBARb', 'FooBaRb'],
    ['foo_bar-baz/qux', 'FooBarBazQux'],
    ['FOO_BAR', 'FooBar'],
    ['foo--bar-Baz', 'FooBarBaz'],
  ])('%s => %s', (input, expected) => {
    expect(toPascalCase(input, { normalize: true })).toMatch(expected);
  });
});

describe('camelCase', () => {
  it.each([
    ['FooBarBaz', 'fooBarBaz'],
    ['FOO_BAR', 'fooBar'],
  ])('%s => %s', (input, expected) => {
    expect(toCamelCase(input, { normalize: true })).toMatch(expected);
  });
});

describe('kebabCase', () => {
  it.each([
    ['', ''],
    ['foo', 'foo'],
    ['foo/Bar', 'foo-bar'],
    ['foo-bAr', 'foo-b-ar'],
    ['foo--bar', 'foo--bar'],
    ['FooBAR', 'foo-bar'],
    ['ALink', 'a-link'],
    ['FOO_BAR', 'foo-bar'],
  ])('%s => %s', (input, expected) => {
    expect(toKebabCase(input)).toMatch(expected);
  });
});

describe('snakeCase', () => {
  it.each([
    ['FooBarBaz', 'foo_bar_baz'],
    ['FOO_BAR', 'foo_bar'],
  ])('%s => %s', (input, expected) => {
    expect(toSnakeCase(input)).toMatch(expected);
  });
});

describe('upperFirst', () => {
  it.each([
    ['', ''],
    ['foo', 'Foo'],
    ['Foo', 'Foo'],
  ])('%s => %s', (input, expected) => {
    expect(toUpperFirst(input)).toMatch(expected);
  });
});

describe('lowerFirst', () => {
  it.each([
    ['', ''],
    ['foo', 'foo'],
    ['Foo', 'foo'],
  ])('%s => %s', (input, expected) => {
    expect(toLowerFirst(input)).toMatch(expected);
  });
});

describe('trainCase', () => {
  it.each([
    ['', ''],
    ['f', 'F'],
    ['foo', 'Foo'],
    ['foo-bAr', 'Foo-B-Ar'],
    ['AcceptCH', 'Accept-CH'],
    ['foo_bar-baz/qux', 'Foo-Bar-Baz-Qux'],
    ['FOO_BAR', 'FOO-BAR'],
    ['foo--bar-Baz', 'Foo-Bar-Baz'],
    ['WWW-authenticate', 'WWW-Authenticate'],
    ['WWWAuthenticate', 'WWW-Authenticate'],
  ])('%s => %s', (input, expected) => {
    expect(toTrainCase(input)).toMatch(expected);
  });

  it.each([
    ['AcceptCH', 'Accept-Ch'],
    ['FOO_BAR', 'Foo-Bar'],
    ['WWW-authenticate', 'Www-Authenticate'],
  ])('%s => %s', (input, expected) => {
    expect(toTrainCase(input, { normalize: true })).toMatch(expected);
  });
});

describe('titleCase', () => {
  it.each([
    ['', ''],
    ['f', 'F'],
    ['foo', 'Foo'],
    ['foo-bar', 'Foo Bar'],
    ['this-IS-aTitle', 'This is a Title'],
  ])('%s => %s', (input, expected) => {
    expect(toTitleCase(input)).toMatch(expected);
  });
});

describe('flatCase', () => {
  it.each([
    ['', ''],
    ['foo', 'foo'],
    ['foo-bAr', 'foobar'],
    ['FooBARb', 'foobarb'],
    ['foo_bar-baz/qux', 'foobarbazqux'],
    ['FOO_BAR', 'foobar'],
    ['foo--bar-Baz', 'foobarbaz'],
  ])('%s => %s', (input, expected) => {
    expect(toFlatCase(input)).toMatch(expected);
  });
});
