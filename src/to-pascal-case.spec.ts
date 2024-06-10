import { TEST_CASES } from '../test/transform-case-provider';
import { toPascalCase } from './to-pascal-case';

describe('to pascal case', () => {
  for (const [input, result, options] of TEST_CASES) {
    it(input, () => {
      expect(toPascalCase(input, options)).toBe(result.pascalCase);
    });
  }
});
