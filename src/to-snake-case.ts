import type { ChangeCaseOptions } from './internal/case.types';

import { toNoCase } from './to-no-case';

/**
 * Convert a string to sentence case.
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
 *   toSnakeCase(str)
 * @example
 *   toSnakeCase('test'); // => 'test'
 *   toSnakeCase('test string'); // => 'test_string'
 *   toSnakeCase('test string', { delimiter: '$' }); // => 'test$string'
 *   toSnakeCase('testV2', { separateNumbers: true }); // => 'test_v_2'
 *   toSnakeCase('__typename', { prefixCharacters: '_' }); // => '__typename'
 *   toSnakeCase('type__', { suffixCharacters: '_' }); // => 'type__'
 * @category String
 */
export function toSnakeCase(input: string, options?: ChangeCaseOptions): string {
  return toNoCase(
    input,
    {
      delimiter: '_',
      ...options,
    },
  );
}
