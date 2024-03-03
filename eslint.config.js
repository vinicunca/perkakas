import { vinicuncaESLint } from '@vinicunca/eslint-config';

export default vinicuncaESLint(
  {
    rules: {
      'function-paren-newline': ['error', 'consistent'],
      'ts/no-namespace': 'off',
      'vinicunca/cognitive-complexity': 'off',
      'vinicunca/consistent-list-newline': 'off',
    },
  },

  {
    files: ['**/*.spec.ts'],
    rules: {
      'vinicunca/no-duplicate-string': 'off',
    },
  },

  {
    files: ['**/tsconfig.json'],
    rules: {
      'jsonc/sort-keys': 'off',
    },
  },
);
