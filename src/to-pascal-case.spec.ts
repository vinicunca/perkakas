import { pascalCase } from './to-pascal-case';

describe('to pascal case', () => {
  it.each([
    ['', ''],
    ['test', 'Test'],
    ['test string', 'TestString'],
    ['Test String', 'TestString'],
    ['test-string', 'TestString'],
    ['FooBARb', 'FooBaRb'],
    ['foo_bar-baz/qux', 'FooBarBazQux'],
    ['FOO_BAR', 'FooBar'],
    ['foo--bar-Baz', 'FooBarBaz'],
    ['Test String', 'Test$String', { delimiter: '$' }],
    ['TestV2', 'TestV2'],
    ['_foo_bar_', 'FooBar'],
    ['version 1.2.10', 'Version_1_2_10'],
    ['testV2', 'TestV_2', { separateNumbers: true }],
    ['𝒳123', '𝒳_123', { separateNumbers: true }],
    ['1test', '1Test', { separateNumbers: true }],
    ['Foo12019Bar', 'Foo_12019Bar', { separateNumbers: true }],
    ['aNumber2in', 'ANumber_2In', { separateNumbers: true }],
    ['V1Test', 'V1Test'],
    ['V1Test with separateNumbers', 'V_1TestWithSeparateNumbers', { separateNumbers: true }],
    ['__typename', '__Typename', { prefixCharacters: '_' }],
    ['type__', 'Type__', { suffixCharacters: '_$' }],
    ['__type__', '__Type__', { prefixCharacters: '_', suffixCharacters: '_' }],
    ['version 1.2.10', 'Version1210', { mergeAmbiguousCharacters: true }],
  ])(
    ('%s => %s'),
    (input, expected, options?) => {
      expect(pascalCase(input, options)).toBe(expected);
    },
  );
});

// https://sky-supply-production.web.app/
