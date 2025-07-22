import { describe, expect, it } from 'vitest';
import { TEST_CASES } from '../test/transform-case-provider';
import { toTrainCase } from './to-train-case';

describe('to train case', () => {
  for (const [input, result, options] of TEST_CASES) {
    it(input, () => {
      expect(toTrainCase(input, options)).toBe(result.trainCase);
    });
  }
});
