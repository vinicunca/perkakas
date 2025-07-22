import { describe, expect, it } from 'vitest';
import { TEST_CASES } from '../test/transform-case-provider';
import { toCapitalCase } from './to-capital-case';

describe('to capital case', () => {
  for (const [input, result, options] of TEST_CASES) {
    it(input, () => {
      expect(toCapitalCase(input, options)).toBe(result.capitalCase);
    });
  }
});
