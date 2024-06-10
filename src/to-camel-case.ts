import type { ChangeCaseOptions } from './helpers/case.types';

import { capitalCaseTransformFactory, pascalCaseTransformFactory, splitPrefixSuffix } from './helpers/case.transform';

/**
 * Convert a string to camel case.
 *
 * @param input the string to convert
 * @param options - Optional configuration for the conversion.
 * @param options.delimiter - The delimiter to use between words.
 * @param options.separateNumbers - If true, an underscore will be injected before the numbers.
 * @param options.prefixCharacters - The prefix characters that we want to ignore.
 * @param options.suffixCharacters - The suffix characters that we want to ignore.
 * @param options.splitFn - A custom split function to separated the words.
 * @param options.mergeAmbiguousCharacters - If true, merges ambiguous characters.
 *
 * @signature
 *   toCamelCase(str)
 * @example
 *   toCamelCase('test'); // => 'test'
 *   toCamelCase('test string'); // => 'testSTring'
 *   toCamelCase('test string', { delimiter: '$' }); // => 'test$string'
 *   toCamelCase('TestV2', { separateNumbers: true }); // => 'testV_2'
 *   toCamelCase('__typename', { prefixCharacters: '_' }); // => '__typename'
 *   toCamelCase('type__', { suffixCharacters: '_' }); // => 'type__'
 *   toCamelCase('version 1.2.10', { mergeAmbiguousCharacters: true }); // => 'version1210'
 * @category String
 */
export function toCamelCase(input: string, options?: ChangeCaseOptions): string {
  const [prefix, words, suffix] = splitPrefixSuffix(input, options);

  const transform = options?.mergeAmbiguousCharacters
    ? capitalCaseTransformFactory()
    : pascalCaseTransformFactory();

  return (
    prefix
    + words
      .map((word, index) => {
        if (index === 0) {
          return word.toLowerCase();
        }

        return transform(word, index);
      })
      .join(options?.delimiter ?? '')
      + suffix
  );
}
