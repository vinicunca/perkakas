import type { ChangeCaseOptions } from './helpers/case.types';

import { capitalCaseTransformFactory, splitPrefixSuffix } from './helpers/case.transform';

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
 *   toSentenceCase(str)
 * @example
 *   toSentenceCase('test'); // => 'Test'
 *   toSentenceCase('test string'); // => 'Test string'
 *   toSentenceCase('test string', { delimiter: '$' }); // => 'Test$String'
 *   toSentenceCase('testV2', { separateNumbers: true }); // => 'Test v 2'
 *   toSentenceCase('__typename', { prefixCharacters: '_' }); // => '__Typename'
 *   toSentenceCase('type__', { suffixCharacters: '_' }); // => 'Type__'
 * @category String
 */
export function toSentenceCase(input: string, options?: ChangeCaseOptions): string {
  const [prefix, words, suffix] = splitPrefixSuffix(input, options);

  const transform = capitalCaseTransformFactory();

  return (
    prefix
    + words
      .map((word, index) => {
        if (index === 0) {
          return transform(word);
        }

        return word.toLowerCase();
      })
      .join(options?.delimiter ?? ' ')
      + suffix
  );
}
