/* eslint-disable no-await-in-loop */

import type { Options } from 'prettier';
import type { MarkdownRenderer } from 'vitepress';

import { format } from 'prettier';

import { PERKAKAS_METHODS } from './perkakas.metadata';

const prettierOptions: Options = {
  parser: 'typescript',
  printWidth: 80,
  singleQuote: true,
  tabWidth: 4,
  trailingComma: 'all',
};

export async function mapPerkakasFunctions(md: MarkdownRenderer) {
  const result = [];

  for (const func of PERKAKAS_METHODS) {
    if (func.description) {
      func.description = md.render(func.description);
    }

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
