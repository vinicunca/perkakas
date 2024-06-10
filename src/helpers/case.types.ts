/**
 * Options used for converting strings to pascal/camel case.
 */
export interface PascalCaseOptions extends ChangeCaseOptions {
  mergeAmbiguousCharacters?: boolean;
}

/**
 * Options used for converting strings to any case.
 */
export interface ChangeCaseOptions {
  delimiter?: string;
  /**
   * Options used for converting strings to pascal/camel case.
   */
  mergeAmbiguousCharacters?: boolean;
  prefixCharacters?: string;
  separateNumbers?: boolean;
  splitFn?: (value: string) => Array<string>;
  suffixCharacters?: string;
}
