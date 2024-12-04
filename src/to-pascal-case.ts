import type { ChangeCaseOptions } from './internal/case.types';

import { capitalCaseTransformFactory, pascalCaseTransformFactory, splitPrefixSuffix } from './internal/case.transform';

/**
 * Convert a string to pascal case.
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
 *   toPascalCase(str)
 * @example
 *   toPascalCase('test'); // => 'Test'
 *   toPascalCase('test string'); // => 'TestString'
 *   toPascalCase('test string', { delimiter: '$' }); // => 'Test$String'
 *   toPascalCase('testV2', { separateNumbers: true }); // => 'TestV_2'
 *   toPascalCase('__typename', { prefixCharacters: '_' }); // => '__Typename'
 *   toPascalCase('type__', { suffixCharacters: '_' }); // => 'Type__'
 *   toPascalCase('version 1.2.10', { mergeAmbiguousCharacters: true }); // => 'Version1210'
 * @category String
 */
export function toPascalCase(input: string, options?: ChangeCaseOptions): string {
  const [prefix, words, suffix] = splitPrefixSuffix(input, options);

  const transform = options?.mergeAmbiguousCharacters
    ? capitalCaseTransformFactory()
    : pascalCaseTransformFactory();

  return (
    prefix
    + words.map(transform).join(options?.delimiter ?? '')
    + suffix
  );
}
