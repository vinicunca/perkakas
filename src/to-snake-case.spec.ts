import { TEST_CASES } from '../test/transform-case-provider';
import { toSnakeCase } from './to-snake-case';

describe('to snake case', () => {
  for (const [input, result, options] of TEST_CASES) {
    it(input, () => {
      expect(toSnakeCase(input, options)).toBe(result.snakeCase);
    });
  }
});
