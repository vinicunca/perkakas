import { OptionDefaults } from 'typedoc';

/** @type {Partial<import('typedoc').TypeDocOptions>} */
export default {
  json: '.vitepress/data/metadata.json',

  tsconfig: '../tsconfig.json',
  entryPoints: ['../src/index.ts'],
  exclude: ['**/*.test.ts', '**/*.test-d.ts'],

  jsDocCompatibility: {
    exampleTag: false,
  },

  blockTags: [
    ...OptionDefaults.blockTags,
    '@dataFirst',
    '@dataLast',
    '@lazy',
    '@signature',
  ],

  excludeNotDocumented: true,
  sourceLinkTemplate: 'https://github.com/vinicunca/perkakas/blob/main/{path}',
};
