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
    pnpm: true,
  },

  {
    rules: {
      'style/function-paren-newline': ['error', 'consistent'],
      'perfectionist/sort-intersection-types': 'off',
      'perfectionist/sort-object-types': 'off',
      'perfectionist/sort-objects': 'off',
      'perfectionist/sort-interfaces': 'off',
      'perfectionist/sort-modules': 'off',
      'sonarjs/use-type-alias': 'off',
      'sonarjs/no-nested-functions': 'off',
      'sonarjs/cognitive-complexity': 'off',
      'sonarjs/no-redundant-optional': 'off',
      'sonarjs/no-nested-conditional': 'off',
      'sonarjs/assertions-in-tests': 'off',
      'sonarjs/different-types-comparison': 'off',
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
      'pnpm/json-enforce-catalog': 'off',
    },
  },

  {
    files: ['**/*.spec.ts', '**/*.spec-d.ts'],
    rules: {
      'perfectionist/sort-union-types': 'off',
      'sonar/no-duplicate-string': 'off',
      // `*.spec-d.ts` isn't in the shared test globs, so pass the options too
      'test/consistent-test-it': [
        'error',
        { fn: 'it', withinDescribe: 'it' },
      ],
    },
  },

  {
    files: ['**/tsconfig.**'],
    rules: {
      'jsonc/sort-keys': 'off',
    },
  },

  {
    files: ['**/*.ts'],
    rules: {
      'style/operator-linebreak': [
        'error',
        'before',
        {
          overrides: { '?': 'ignore', ':': 'ignore' },
        },
      ],
    },
  },

  {
    // Markdown code blocks aren't in `tsconfig.eslint.json`, so parse them
    // without type information
    files: ['**/*.md/**'],
    languageOptions: {
      parserOptions: {
        project: null,
      },
    },
  },
);
