import type { ChangeCaseOptions } from './case.types';

// Regexps involved with splitting words in various case formats.
const SPLIT_LOWER_UPPER_RE = /([\p{Ll}\d])(\p{Lu})/gu;
const SPLIT_UPPER_UPPER_RE = /(\p{Lu})(\p{Lu}\p{Ll})/gu;

// Used to iterate over the initial split result and separate numbers.
const SPLIT_SEPARATE_NUMBER_RE = /(\d)\p{Ll}|(\p{L})\d/u;

// Regexp involved with stripping non-word characters from the result.
const DEFAULT_STRIP_REGEXP = /[^\p{L}\d]+/giu;

// The replacement value for splits.
const SPLIT_REPLACE_VALUE = '$1\0$2';

// The default characters to keep after transforming case.
const DEFAULT_PREFIX_SUFFIX_CHARACTERS = '';

export function splitPrefixSuffix(
  input: string,
  options: ChangeCaseOptions = {},
): [string, Array<string>, string] {
  const splitFn = options.splitFn ?? (
    options.separateNumbers
      ? splitSeparateNumbers
      : splitImplementation
  );
  const prefixCharacters
    = options.prefixCharacters ?? DEFAULT_PREFIX_SUFFIX_CHARACTERS;
  const suffixCharacters
    = options.suffixCharacters ?? DEFAULT_PREFIX_SUFFIX_CHARACTERS;
  let prefixIndex = 0;
  let suffixIndex = input.length;

  while (prefixIndex < input.length) {
    const char = input.charAt(prefixIndex);
    if (!prefixCharacters.includes(char)) {
      break;
    }
    prefixIndex++;
  }

  while (suffixIndex > prefixIndex) {
    const index = suffixIndex - 1;
    const char = input.charAt(index);
    if (!suffixCharacters.includes(char)) {
      break;
    }
    suffixIndex = index;
  }

  return [
    input.slice(0, prefixIndex),
    splitFn(input.slice(prefixIndex, suffixIndex)),
    input.slice(suffixIndex),
  ];
}

/**
 * Split any cased input strings into an array of words.
 */
export function splitImplementation(value: string): Array<string> {
  let result = value.trim();

  result = result
    .replace(SPLIT_LOWER_UPPER_RE, SPLIT_REPLACE_VALUE)
    .replace(SPLIT_UPPER_UPPER_RE, SPLIT_REPLACE_VALUE);

  result = result.replace(DEFAULT_STRIP_REGEXP, '\0');

  let start = 0;
  let end = result.length;

  // Trim the delimiter from around the output string.
  while (result.charAt(start) === '\0') {
    start++;
  }

  if (start === end) {
    return [];
  }

  while (result.charAt(end - 1) === '\0') {
    end--;
  }

  return result.slice(start, end).split(/\0/);
}

export function capitalCaseTransformFactory() {
  return (word: string): string => word[0]!.toUpperCase() + word.slice(1).toLowerCase();
}

export function pascalCaseTransformFactory() {
  return (word: string, index: number): string => {
    const char0 = word[0]!;
    const initial = index > 0 && char0 >= '0' && char0 <= '9'
      ? `_${char0}`
      : char0.toUpperCase();
    return initial + word.slice(1).toLowerCase();
  };
}

/**
 * Split the input string into an array of words, separating numbers.
 */
export function splitSeparateNumbers(value: string): Array<string> {
  const words = splitImplementation(value);
  for (let i = 0; i < words.length; i++) {
    const word = words[i]!;
    const match = SPLIT_SEPARATE_NUMBER_RE.exec(word);
    if (match) {
      const offset = match.index + (match[1] ?? match[2])!.length;
      words.splice(i, 1, word.slice(0, offset), word.slice(offset));
    }
  }
  return words;
}
