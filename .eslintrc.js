const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  extends: ['@vinicunca/eslint-config'],

  rules: {
    'sonarjs/prefer-single-boolean-return': 'off',
    'sonarjs/cognitive-complexity': 'off',
  },
});
