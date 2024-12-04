import type { ChangeCaseOptions } from './internal/case.types';

import { toCapitalCase } from './to-capital-case';

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
 *   toTrainCase(str)
 * @example
 *   toTrainCase('test'); // => 'Test'
 *   toTrainCase('test string'); // => 'Test-String'
 *   toTrainCase('test string', { delimiter: '$' }); // => 'Test$String'
 *   toTrainCase('testV2', { separateNumbers: true }); // => 'Test-V-2'
 *   toTrainCase('__typename', { prefixCharacters: '_' }); // => '__Typename'
 *   toTrainCase('type__', { suffixCharacters: '_' }); // => 'Type__'
 * @category String
 */
export function toTrainCase(input: string, options?: ChangeCaseOptions): string {
  return toCapitalCase(
    input,
    {
      delimiter: '-',
      ...options,
    },
  );
}
