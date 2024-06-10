import { TEST_CASES } from '../test/transform-case-provider';
import { toSentenceCase } from './to-sentence-case';

describe('to sentence case', () => {
  for (const [input, result, options] of TEST_CASES) {
    it(input, () => {
      expect(toSentenceCase(input, options)).toBe(result.sentenceCase);
    });
  }
});
