import { TEST_CASES } from '../test/transform-case-provider';
import { toCamelCase } from './to-camel-case';

describe('to camel case', () => {
  for (const [input, result, options] of TEST_CASES) {
    it(input, () => {
      expect(toCamelCase(input, options)).toBe(result.camelCase);
    });
  }

  it('should merge ambiguous characters', () => {
    const input = 'version 1.2.10';

    expect(toCamelCase(input, { mergeAmbiguousCharacters: true })).toEqual(
      'version1210',
    );
  });
});
