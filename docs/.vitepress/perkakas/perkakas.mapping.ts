/* eslint-disable no-await-in-loop */

import type { Options } from 'prettier';
import type { SiteConfig } from 'vitepress';

import { format } from 'prettier';
import { createMarkdownRenderer } from 'vitepress';

import { PERKAKAS_METHODS } from './perkakas.metadata';

const prettierOptions: Options = {
  parser: 'typescript',
  printWidth: 80,
  singleQuote: true,
  tabWidth: 4,
  trailingComma: 'all',
};

export async function mapPerkakasFunctions(siteConfig: SiteConfig) {
  const md = await createMarkdownRenderer(siteConfig.srcDir, siteConfig.markdown, siteConfig.site.base, siteConfig.logger);

  const result = [];

  for (const func of PERKAKAS_METHODS) {
    const methods = [];

    for (const method of func.methods) {
      const examples = await format(method.example ?? '', prettierOptions);
      const signatures = await format(method.signature ?? '', prettierOptions);

      methods.push({
        ...method,
        example: md.render(`
  \`\`\`ts
  ${examples}
  \`\`\`
  `),
        signature: md.render(`
  \`\`\`ts
  ${signatures}
  \`\`\`
  `),
      });
    }

    result.push({
      ...func,
      methods,
    });
  }

  return result;
}
