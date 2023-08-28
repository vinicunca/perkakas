const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  extends: ['@vinicunca/eslint-config'],

  rules: {
    'sonarjs/prefer-single-boolean-return': 'off',
    'sonarjs/cognitive-complexity': 'off',
    'sonarjs/no-duplicate-string': 'off',

    // We provide function extensions (e.g. lazy, indexed, sub-functions,
    // etc...) via namespaces by design.
    '@typescript-eslint/no-namespace': 'off',

    // TODO: There are a ton of `any` throughout the codebase, they should be
    // replaced by `unknown` or better types.
    '@typescript-eslint/no-explicit-any': 'off',

    // TODO: The idiom for using `purry` right now is via the `arguments`
    // reserved keyword, but it's recommended to use a variadic instead (e.g.
    // `function foo(...args: readonly unknown[])`)
    'prefer-rest-params': 'off',
  },
});
