import { describe, expect, it } from 'vitest';
import { TEST_CASES } from '../test/transform-case-provider';

import { toNoCase } from './to-no-case';

describe('to no case', () => {
  for (const [input, result, options] of TEST_CASES) {
    it(input, () => {
      expect(toNoCase(input, options)).toBe(result.noCase);
    });
  }
});
