const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  extends: ['@vinicunca/eslint-config'],

  rules: {
    'sonarjs/prefer-single-boolean-return': 'off',
    'sonarjs/cognitive-complexity': 'off',

    // We provide function extensions (e.g. lazy, indexed, sub-functions,
    // etc...) via namespaces by design.
    '@typescript-eslint/no-namespace': 'off',

    // TODO: There are a ton of `any` throughout the codebase, they should be
    // replaced by `unknown` or better types.
    '@typescript-eslint/no-explicit-any': 'off',
  },
});
