import type { ChangeCaseOptions } from './helpers/case.types';

import { splitPrefixSuffix } from './helpers/case.transform';

/**
 * Convert a string to space separated lower case.
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
 *   toNoCase(str)
 * @example
 *   toNoCase('test'); // => 'test'
 *   toNoCase('test string'); // => 'test string'
 *   toNoCase('test string', { delimiter: '$' }); // => 'test$string'
 *   toNoCase('testV2', { separateNumbers: true }); // => 'test v 2'
 *   toNoCase('__typename', { prefixCharacters: '_' }); // => '__typename'
 *   toNoCase('type__', { suffixCharacters: '_' }); // => 'type__'
 * @category String
 */
export function toNoCase(input: string, options?: ChangeCaseOptions): string {
  const [prefix, words, suffix] = splitPrefixSuffix(input, options);

  return (
    prefix
    + words
      .map((word) => word.toLowerCase())
      .join(options?.delimiter ?? ' ')
      + suffix
  );
}
