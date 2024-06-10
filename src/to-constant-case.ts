import type { ChangeCaseOptions } from './helpers/case.types';

import { splitPrefixSuffix } from './helpers/case.transform';

/**
 * Convert a string to pascal case.
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
 *   toConstantCase(str)
 * @example
 *   toConstantCase('test'); // => 'TEST'
 *   toConstantCase('test string'); // => 'TEST_STRING'
 *   toConstantCase('test string', { delimiter: '$' }); // => 'TEST$STRING'
 *   toConstantCase('testV2', { separateNumbers: true }); // => 'TEST_V_2'
 *   toConstantCase('__typename', { prefixCharacters: '_' }); // => '__TYPENAME'
 *   toConstantCase('type__', { suffixCharacters: '_' }); // => 'TYPE__'
 * @category String
 */
export function toConstantCase(input: string, options?: ChangeCaseOptions): string {
  const [prefix, words, suffix] = splitPrefixSuffix(input, options);

  return (
    prefix
    + words
      .map((word) => word.toUpperCase())
      .join(options?.delimiter ?? '_')
      + suffix
  );
}
