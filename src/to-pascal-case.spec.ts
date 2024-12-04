import { TEST_CASES } from '../test/transform-case-provider';
import { toPascalCase } from './to-pascal-case';

describe('to pascal case', () => {
  for (const [input, result, options] of TEST_CASES) {
    it(input, () => {
      expect(toPascalCase(input, options)).toBe(result.pascalCase);
    });
  }

  it('should merge ambiguous characters', () => {
    const input = 'version 1.2.10';

    expect(toPascalCase(input, { mergeAmbiguousCharacters: true })).toBe(
      'Version1210',
    );
  });
});
