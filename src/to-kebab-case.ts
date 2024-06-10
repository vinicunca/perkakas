import type { ChangeCaseOptions } from './helpers/case.types';

import { toNoCase } from './to-no-case';

/**
 * Convert a string to kebab case.
 *
 * @param input the string to convert
 * @param options - Optional configuration for the conversion.
 * @param options.delimiter - The delimiter to use between words.
 * @param options.separateNumbers - If true, numbers will be separated.
 * @param options.prefixCharacters - The prefix characters that we want to ignore.
 * @param options.suffixCharacters - The suffix characters that we want to ignore.
 * @param options.splitFn - A custom split function to separated the words.
 * @param options.mergeAmbiguousCharacters - If true, merges ambiguous characters.
 *
 * @signature
 *   toKebabCase(str)
 * @example
 *   toKebabCase('test'); // => 'test'
 *   toKebabCase('test string'); // => 'test-string'
 *   toKebabCase('test string', { delimiter: '$' }); // => 'test$string'
 *   toKebabCase('testV2', { separateNumbers: true }); // => 'test-v-2'
 *   toKebabCase('__typename', { prefixCharacters: '_' }); // => '__typename'
 *   toKebabCase('type__', { suffixCharacters: '_' }); // => 'type__'
 * @category String
 */
export function toKebabCase(input: string, options?: ChangeCaseOptions): string {
  return toNoCase(
    input,
    {
      delimiter: '-',
      ...options,
    },
  );
}
