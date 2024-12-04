import type { ChangeCaseOptions } from './internal/case.types';

import { capitalCaseTransformFactory, splitPrefixSuffix } from './internal/case.transform';

/**
 * Convert a string to capital case.
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
 *   toCapitalCase(str)
 * @example
 *   toCapitalCase('test'); // => 'Test'
 *   toCapitalCase('test string'); // => 'Test String'
 *   toCapitalCase('test string', { delimiter: '$' }); // => 'Test$String'
 *   toCapitalCase('testV2', { separateNumbers: true }); // => 'TEST V 2'
 *   toCapitalCase('__typename', { prefixCharacters: '_' }); // => '__Typename'
 *   toCapitalCase('type__', { suffixCharacters: '_' }); // => 'Type__'
 * @category String
 */
export function toCapitalCase(input: string, options?: ChangeCaseOptions): string {
  const [prefix, words, suffix] = splitPrefixSuffix(input, options);

  return (
    prefix
    + words
      .map(capitalCaseTransformFactory())
      .join(options?.delimiter ?? ' ')
      + suffix
  );
}
