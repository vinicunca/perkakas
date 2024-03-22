export const eslintSidebar = [
  {
    collapsed: true,
    items: [
      { link: '/eslint/user-guide/installation', text: 'Installation' },
    ],
    text: 'User Guide',

  },
  {
    collapsed: true,
    items: [
      generateConfigSidelink({ icon: 'i-simple-icons:eslint', link: 'ignores', text: 'Ignores' }),
      generateConfigSidelink({ icon: 'i-logos:javascript', link: 'javascript', text: 'Javascript' }),
      generateConfigSidelink({ icon: 'i-fa-regular:comments', link: 'eslint-comments', text: 'Eslint Comments' }),
      generateConfigSidelink({ icon: 'i-logos:nodejs-icon-alt', link: 'node', text: 'NodeJS' }),
      generateConfigSidelink({ icon: 'i-simple-line-icons:docs', link: 'jsdoc', text: 'JSDoc' }),
      generateConfigSidelink({ icon: 'i-carbon:document-import', link: 'imports', text: 'Imports' }),
      generateConfigSidelink({ icon: 'i-openmoji:unicorn', link: 'unicorn', text: 'Unicorn' }),
      generateConfigSidelink({ icon: 'i-logos:typescript-icon', link: 'typescript', text: 'Typescript' }),
      generateConfigSidelink({ icon: 'i-vin:eslint-style', link: 'stylistic', text: 'Stylistic' }),
      generateConfigSidelink({ icon: 'i-file-icons:test-generic', link: 'test', text: 'Test' }),
      generateConfigSidelink({ icon: 'i-logos:vue', link: 'vue', text: 'Vue' }),
      generateConfigSidelink({ icon: 'i-carbon:json', link: 'jsonc', text: 'JSONC' }),
      generateConfigSidelink({ icon: 'i-logos:nodejs-icon', link: 'sort-package-json', text: 'Sort package.json' }),
      generateConfigSidelink({ icon: 'i-vscode-icons:file-type-tsconfig', link: 'sort-tsconfig', text: 'Sort tsconfig' }),
      generateConfigSidelink({ icon: 'i-vin:yaml', link: 'yaml', text: 'YAML' }),
      generateConfigSidelink({ icon: 'i-simple-icons:markdown', link: 'markdown', text: 'Markdown' }),
      generateConfigSidelink({ icon: 'i-logos:react', link: 'react', text: 'React' }),
    ],
    text: 'Configs',
  },
  {
    collapsed: true,
    items: [
      { link: '/eslint/plugin-vinicunca/cognitive-complexity', text: 'cognitive-complexity' },
      { link: '/eslint/plugin-vinicunca/consistent-list-newline', text: 'consistent-list-newline' },
      { link: '/eslint/plugin-vinicunca/if-newline', text: 'if-newline' },
      { link: '/eslint/plugin-vinicunca/import-dedupe', text: 'import-dedupe' },
      { link: '/eslint/plugin-vinicunca/no-all-duplicated-branches', text: 'no-all-duplicated-branches' },
      { link: '/eslint/plugin-vinicunca/no-collapsible-if', text: 'no-collapsible-if' },
      { link: '/eslint/plugin-vinicunca/no-duplicate-string', text: 'no-duplicate-string' },
      { link: '/eslint/plugin-vinicunca/no-duplicated-branches', text: 'no-duplicated-branches' },
      { link: '/eslint/plugin-vinicunca/no-empty-collection', text: 'no-empty-collection' },
      { link: '/eslint/plugin-vinicunca/no-identical-conditions', text: 'no-identical-conditions' },
      { link: '/eslint/plugin-vinicunca/no-identical-expressions', text: 'no-identical-expressions' },
      { link: '/eslint/plugin-vinicunca/no-identical-functions', text: 'no-identical-functions' },
      { link: '/eslint/plugin-vinicunca/no-ignored-return', text: 'no-ignored-return' },
      { link: '/eslint/plugin-vinicunca/no-import-node-modules-by-path', text: 'no-import-node-modules-by-path' },
      { link: '/eslint/plugin-vinicunca/no-nested-template-literals', text: 'no-nested-template-literals' },
      { link: '/eslint/plugin-vinicunca/no-redundant-boolean', text: 'no-redundant-boolean' },
      { link: '/eslint/plugin-vinicunca/no-redundant-jump', text: 'no-redundant-jump' },
      { link: '/eslint/plugin-vinicunca/no-ts-export-equal', text: 'no-ts-export-equal' },
      { link: '/eslint/plugin-vinicunca/no-unused-collection', text: 'no-unused-collection' },
      { link: '/eslint/plugin-vinicunca/no-use-of-empty-return-value', text: 'no-use-of-empty-return-value' },
      { link: '/eslint/plugin-vinicunca/prefer-immediate-return', text: 'prefer-immediate-return' },
      { link: '/eslint/plugin-vinicunca/prefer-single-boolean-return', text: 'prefer-single-boolean-return' },
      { link: '/eslint/plugin-vinicunca/top-level-function', text: 'top-level-function' },
    ],
    text: 'Plugins',
  },
];

interface ConfigSideLink {
  icon: string;
  link: string;
  text: string;
}

function generateConfigSidelink(options: ConfigSideLink) {
  return {
    link: `/eslint/configs/${options.link}`,
    text: `<i class="${options.icon}"></i> ${options.text}`,
  };
}
