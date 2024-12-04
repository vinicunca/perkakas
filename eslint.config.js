import { vinicuncaESLint } from '@vinicunca/eslint-config';

export default vinicuncaESLint(
  {
    formatters: false,
    react: false,
    typescript: {
      parserOptions: {
        project: ['./tsconfig.eslint.json'],
      },
    },
    unocss: false,
    vue: false,
  },

  {
    rules: {
      'function-paren-newline': ['error', 'consistent'],
      'perfectionist/sort-intersection-types': 'off',
      'perfectionist/sort-object-types': 'off',
      'perfectionist/sort-objects': 'off',
      'perfectionist/sort-interfaces': 'off',
      'perfectionist/sort-modules': 'off',
      'sonar/use-type-alias': 'off',
      'sonar/no-nested-functions': 'off',
      'sonar/cognitive-complexity': 'off',
      'sonar/no-redundant-optional': 'off',
      'sonar/no-nested-conditional': 'off',
      'vinicunca/cognitive-complexity': 'off',
      'vinicunca/consistent-list-newline': 'off',

      'ts/no-explicit-any': 'error',
      'ts/explicit-function-return-type': [
        'error',
        { allowExpressions: true },
      ],
      'ts/explicit-module-boundary-types': [
        'warn',
        { allowTypedFunctionExpressions: false },
      ],
    },
  },

  {
    files: ['**/*.spec.ts', '**/*.spec-d.ts'],
    rules: {
      'perfectionist/sort-union-types': 'off',
      'sonar/no-duplicate-string': 'off',
    },
  },

  {
    files: ['**/tsconfig.**'],
    rules: {
      'jsonc/sort-keys': 'off',
    },
  },

  {
    files: ['**/docs/**'],
    rules: {
      'ts/explicit-function-return-type': 'off',
      'ts/explicit-module-boundary-types': 'off',
    },
  },
);
