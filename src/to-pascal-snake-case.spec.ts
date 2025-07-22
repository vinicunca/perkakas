import { describe, expect, it } from 'vitest';
import { TEST_CASES } from '../test/transform-case-provider';

import { toPascalSnakeCase } from './to-pascal-snake-case';

describe('to pascal snake case', () => {
  for (const [input, result, options] of TEST_CASES) {
    it(input, () => {
      expect(toPascalSnakeCase(input, options)).toBe(result.pascalSnakeCase);
    });
  }
});
