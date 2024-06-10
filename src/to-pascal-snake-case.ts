import type { ChangeCaseOptions } from './helpers/case.types';

import { toCapitalCase } from './to-capital-case';

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
 *   toPascalSnakeCase(str)
 * @example
 *   toPascalSnakeCase('test'); // => 'Test'
 *   toPascalSnakeCase('test string'); // => 'Test_String'
 *   toPascalSnakeCase('test string', { delimiter: '$' }); // => 'Test$String'
 *   toPascalSnakeCase('testV2', { separateNumbers: true }); // => 'Test_V_2'
 *   toPascalSnakeCase('__typename', { prefixCharacters: '_' }); // => '__Typename'
 *   toPascalSnakeCase('type__', { suffixCharacters: '_' }); // => 'Type__'
 * @category String
 */
export function toPascalSnakeCase(input: string, options?: ChangeCaseOptions): string {
  return toCapitalCase(
    input,
    {
      delimiter: '_',
      ...options,
    },
  );
}
