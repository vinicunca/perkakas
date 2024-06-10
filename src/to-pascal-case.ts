// import type { ChangeCaseOptions } from './helpers/case.types';

import { capitalCaseTransformFactory, pascalCaseTransformFactory, splitPrefixSuffix } from './helpers/case.transform';

/**
 * Options used for converting strings to any case.
 */
export interface ChangeCaseOptions {
  delimiter?: string;
  separateNumbers?: boolean;
  prefixCharacters?: string;
  suffixCharacters?: string;
  splitFn?: (value: string) => Array<string>;
  /**
   * Options used for converting strings to pascal/camel case.
   */
  mergeAmbiguousCharacters?: boolean;
}

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
 *   toCamelCase(str)
 * @example
 *   toCamelCase('foo-bar'); // => 'FooBar'
 *   toCamelCase('foo-bar', { delimiter: '$' }); // => 'Foo$Bar'
 *   toCamelCase('testV2', { separateNumbers: true }); // => 'TestV_2'
 *   toCamelCase('__typename', { prefixCharacters: '_' }); // => '__Typename'
 *   toCamelCase('type__', { suffixCharacters: '_' }); // => 'Type__'
 * @category String
 */
export function pascalCase(input: string, options?: ChangeCaseOptions): string {
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
