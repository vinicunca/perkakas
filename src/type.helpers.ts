/* eslint-disable ts/no-explicit-any */

interface TightMap<O = any> {
  [key: string]: TightMap | O;
}

export type DeepPartial<T, O = any> = {
  [P in keyof T]?: T[P] extends Array<string>
    ? string
    : T[P] extends object
      ? DeepPartial<T[P], O>
      : T[P];
} & {
  [key: string]: O | TightMap<O>;
};
