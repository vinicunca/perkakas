import { TEST_CASES } from '../test/transform-case-provider';
import { toKebabCase } from './to-kebab-case';

describe('to kebab case', () => {
  for (const [input, result, options] of TEST_CASES) {
    it(input, () => {
      expect(toKebabCase(input, options)).toBe(result.kebabCase);
    });
  }
});
