import { TEST_CASES } from '../test/transform-case-provider';
import { toConstantCase } from './to-constant-case';

describe('to constant case', () => {
  for (const [input, result, options] of TEST_CASES) {
    it(input, () => {
      expect(toConstantCase(input, options)).toBe(result.constantCase);
    });
  }
});
