import type {
  CamelCase,
  CaseOptions,
  FlatCase,
  KebabCase,
  PascalCase,
  SnakeCase,
  SplitByCase,
  TrainCase,
} from './internal/types/strings';

const NUMBER_CHAR_RE = /\d/;
const STR_SPLITTERS = ['-', '_', '/', '.'] as const;

export function isUppercase(char = ''): boolean | undefined {
  if (NUMBER_CHAR_RE.test(char)) {
    return undefined;
  }
  return char !== char.toLowerCase();
}

export function splitByCase<T extends string>(str: T): SplitByCase<T>;
export function splitByCase<
  T extends string,
  Separator extends ReadonlyArray<string>,
>(str: T, separators: Separator): SplitByCase<T, Separator[number]>;
export function splitByCase<
  T extends string,
  Separator extends ReadonlyArray<string>,
>(str: T, separators?: Separator): SplitByCase<T, Separator[number]> {
  const splitters = separators ?? STR_SPLITTERS;
  const parts: Array<string> = [];

  if (!str || typeof str !== 'string') {
    return parts as SplitByCase<T, Separator[number]>;
  }

  let buff = '';

  let previousUpper: boolean | undefined;
  let previousSplitter: boolean | undefined;

  for (const char of str) {
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
        const lastChar = buff.at(-1);
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

export function toUpperFirst<S extends string>(str: S): Capitalize<S> {
  return (str ? str[0]?.toUpperCase() + str.slice(1) : '') as Capitalize<S>;
}

export function toLowerFirst<S extends string>(str: S): Uncapitalize<S> {
  return (str ? str[0]?.toLowerCase() + str.slice(1) : '') as Uncapitalize<S>;
}

export function toPascalCase(): '';
export function toPascalCase<
  T extends string | ReadonlyArray<string>,
  UserCaseOptions extends CaseOptions = CaseOptions,
>(str: T, opts?: CaseOptions): PascalCase<T, UserCaseOptions['normalize']>;
export function toPascalCase<
  T extends string | ReadonlyArray<string>,
  UserCaseOptions extends CaseOptions = CaseOptions,
>(str?: T, opts?: UserCaseOptions): string {
  return str
    ? ((Array.isArray(str) ? str : splitByCase(str as string))
        .map((p) => toUpperFirst(opts?.normalize ? p.toLowerCase() : p))
        .join('') as PascalCase<T, UserCaseOptions['normalize']>)
    : '';
}

export function toCamelCase(): '';
export function toCamelCase<
  T extends string | ReadonlyArray<string>,
  UserCaseOptions extends CaseOptions = CaseOptions,
>(str: T, opts?: UserCaseOptions): CamelCase<T, UserCaseOptions['normalize']>;
export function toCamelCase<
  T extends string | ReadonlyArray<string>,
  UserCaseOptions extends CaseOptions = CaseOptions,
>(str?: T, opts?: UserCaseOptions): string {
  return toLowerFirst(toPascalCase(str || '', opts)) as CamelCase<
    T,
    UserCaseOptions['normalize']
  >;
}

export function toKebabCase(): '';
export function toKebabCase<T extends string | ReadonlyArray<string>>(
  str: T,
): KebabCase<T>;
export function toKebabCase<
  T extends string | ReadonlyArray<string>,
  Joiner extends string,
>(str: T, joiner: Joiner): KebabCase<T, Joiner>;
export function toKebabCase<
  T extends string | ReadonlyArray<string>,
  Joiner extends string,
>(str?: T, joiner?: Joiner): string {
  return str
    ? ((Array.isArray(str) ? str : splitByCase(str as string))
        .map((p) => p.toLowerCase())
        .join(joiner ?? '-') as KebabCase<T, Joiner>)
    : '';
}

export function toSnakeCase(): '';
export function toSnakeCase<T extends string | ReadonlyArray<string>>(
  str: T,
): SnakeCase<T>;
export function toSnakeCase<T extends string | ReadonlyArray<string>>(str?: T): string {
  return toKebabCase(str || '', '_') as SnakeCase<T>;
}

export function toFlatCase(): '';
export function toFlatCase<T extends string | ReadonlyArray<string>>(
  str: T,
): FlatCase<T>;
export function toFlatCase<T extends string | ReadonlyArray<string>>(str?: T): string {
  return toKebabCase(str || '', '') as FlatCase<T>;
}

export function toTrainCase(): '';
export function toTrainCase<
  T extends string | ReadonlyArray<string>,
  UserCaseOptions extends CaseOptions = CaseOptions,
>(str: T, opts?: UserCaseOptions): TrainCase<T, UserCaseOptions['normalize']>;
export function toTrainCase<
  T extends string | ReadonlyArray<string>,
  UserCaseOptions extends CaseOptions = CaseOptions,
>(str?: T, opts?: UserCaseOptions): string {
  return (Array.isArray(str) ? str : splitByCase(str as string))
    .filter(Boolean)
    .map((p) => toUpperFirst(opts?.normalize ? p.toLowerCase() : p))
    .join('-') as TrainCase<T, UserCaseOptions['normalize']>;
}

// eslint-disable-next-line regexp/no-unused-capturing-group
const titleCaseExceptions = /^(a|an|and|as|at|but|by|for|if|in|is|nor|of|on|or|the|to|with)$/i;

export function toTitleCase(): '';
export function toTitleCase<
  T extends string | ReadonlyArray<string>,
  UserCaseOptions extends CaseOptions = CaseOptions,
>(
  str: T,
  opts?: UserCaseOptions,
): TrainCase<T, UserCaseOptions['normalize'], ' '>;
export function toTitleCase<
  T extends string | ReadonlyArray<string>,
  UserCaseOptions extends CaseOptions = CaseOptions,
>(str?: T, opts?: UserCaseOptions): string {
  return (Array.isArray(str) ? str : splitByCase(str as string))
    .filter(Boolean)
    .map((p) =>
      titleCaseExceptions.test(p)
        ? p.toLowerCase()
        : toUpperFirst(opts?.normalize ? p.toLowerCase() : p))
    .join(' ') as TrainCase<T, UserCaseOptions['normalize']>;
}
