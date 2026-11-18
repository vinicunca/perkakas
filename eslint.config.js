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
    files: ['src/*.ts'],
    ignores: [
      'src/index.ts',
      'src/**/*.spec.ts',
      'src/**/*.spec-d.ts',
      'src/**/*.spec-prop.ts',
    ],
    rules: {
      'ts/no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '/curry$',
              message:
                'Pass the arguments as parameters: curry1-3, curryWithLazy1-3, or a typeof check.',
            },
            {
              regex: String.raw`^(?!\./internal/|type-fest$)`,
              message:
                'Utilities import only from src/internal and type-fest: move what this needs into src/internal.',
            },
          ],
        },
      ],
    },
  },

  {
    files: ['src/internal/*.ts'],
    ignores: ['src/**/*.spec.ts', 'src/**/*.spec-d.ts'],
    rules: {
      'ts/no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: String.raw`^(?!\./|type-fest$)`,
              message:
                'src/internal sits below the utilities and imports only itself and type-fest: move what this needs into src/internal.',
            },
          ],
        },
      ],
    },
  },

  {
    files: ['src/internal/types/*.ts'],
    ignores: ['src/**/*.spec-d.ts'],
    rules: {
      'ts/no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: String.raw`^(?!\./[^/]+$|type-fest$)`,
              message:
                'Types in src/internal/types import only each other and type-fest: move the type this needs into src/internal/types.',
            },
          ],
        },
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
