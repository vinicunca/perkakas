import { isString } from '../guard';
import type { CamelCase, JoinByCase, PascalCase, SplitByCase } from './cases-types';

const RE_NUMBER_CHAR = /\d/;
const STR_SPLITTERS = ['-', '_', '/', '.'] as const;

export function isUppercase(char = ''): boolean | undefined {
  if (RE_NUMBER_CHAR.test(char)) {
    return undefined;
  }
  return char.toUpperCase() === char;
}

export function splitByCase<T extends string>(string_: T): SplitByCase<T>;
export function splitByCase<
  T extends string,
  Separator extends readonly string[],
>(string_: T, separators: Separator): SplitByCase<T, Separator[number]>;
export function splitByCase<
  T extends string,
  Separator extends readonly string[],
>(string_: T, separators?: Separator) {
  const splitters = separators ?? STR_SPLITTERS;
  const parts: string[] = [];

  if (!string_ || !isString(string_)) {
    return parts as SplitByCase<T, Separator[number]>;
  }

  let buff = '';

  let previousUpper: boolean | undefined;
  let previousSplitter: boolean | undefined;

  for (const char of string_) {
    // Splitter
    const isSplitter = (splitters as unknown as string).includes(char);
    if (isSplitter === true) {
      parts.push(buff);
      buff = '';
      previousUpper = undefined;
      continue;
    }

    const isUpper = isUppercase(char);
    if (previousSplitter === false) {
      // Case rising edge
      if (previousUpper === false && isUpper === true) {
        parts.push(buff);
        buff = char;
        previousUpper = isUpper;
        continue;
      }
      // Case falling edge
      if (previousUpper === true && isUpper === false && buff.length > 1) {
        const lastChar = buff[buff.length - 1];
        parts.push(buff.slice(0, Math.max(0, buff.length - 1)));
        buff = lastChar + char;
        previousUpper = isUpper;
        continue;
      }
    }

    // Normal char
    buff += char;
    previousUpper = isUpper;
    previousSplitter = isSplitter;
  }

  parts.push(buff);

  return parts as SplitByCase<T, Separator[number]>;
}

export function toUpperFirst<S extends string>(string_: S): Capitalize<S> {
  return (
    !string_ ? '' : string_[0].toUpperCase() + string_.slice(1)
  ) as Capitalize<S>;
}

export function toLowerFirst<S extends string>(string_: S): Uncapitalize<S> {
  return (
    !string_ ? '' : string_[0].toLowerCase() + string_.slice(1)
  ) as Uncapitalize<S>;
}

export function toPascalCase(): '';
export function toPascalCase<T extends string | readonly string[]>(
  string_?: T
): PascalCase<T>;
export function toPascalCase<T extends string | readonly string[]>(string_?: T) {
  return !string_
    ? ''
    : ((Array.isArray(string_) ? string_ : splitByCase(string_ as string))
        .map((p) => toUpperFirst(p))
        .join('') as PascalCase<T>);
}

export function toCamelCase(): '';
export function toCamelCase<T extends string | readonly string[]>(
  string_?: T
): CamelCase<T>;
export function toCamelCase<T extends string | readonly string[]>(string_?: T) {
  return toLowerFirst(toPascalCase(string_ || '')) as CamelCase<T>;
}

export function toKebabCase(): '';
export function toKebabCase<T extends string | readonly string[]>(
  string_?: T
): JoinByCase<T, '-'>;
export function toKebabCase<
  T extends string | readonly string[],
  Joiner extends string,
>(string_: T, joiner: Joiner): JoinByCase<T, Joiner>;
export function toKebabCase<
  T extends string | readonly string[],
  Joiner extends string,
>(string_?: T, joiner?: Joiner) {
  return !string_
    ? ''
    : ((Array.isArray(string_) ? string_ : splitByCase(string_ as string))
        .map((p) => p.toLowerCase())
        .join(joiner ?? '-') as JoinByCase<T, Joiner>);
}

export function toSnakeCase(): '';
export function toSnakeCase<T extends string | readonly string[]>(
  string_?: T
): JoinByCase<T, '_'>;
export function toSnakeCase<T extends string | readonly string[]>(string_?: T) {
  return toKebabCase(string_ || '', '_') as JoinByCase<T, '_'>;
}
