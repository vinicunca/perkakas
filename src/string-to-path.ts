/**
 * Converts a path string to an array of keys.
 * @param path a string path
 * @signature stringToPathArray(path)
 * @example stringToPathArray('a.b[0].c') // => ['a', 'b', 0, 'c']
 * @dataFirst
 * @category String
 */
export function stringToPath<Path extends string>(
  path: Path,
): StringToPath<Path> {
  return stringToPath_(path) as StringToPath<Path>;
}

function stringToPath_(path: string): Array<string> {
  if (path.length === 0) {
    return [];
  }

  const match = /^\[(.+?)\](.*)$/u.exec(path) ?? /^\.?([^.[\]]+)(.*)$/u.exec(path);
  if (match !== null) {
    const [, key, rest] = match;
    // @ts-expect-error [ts2322] - Can we improve typing here to assure that `key` and `rest` are defined when the regex matches?
    return [key, ...stringToPath_(rest)];
  }
  return [path];
}

export type StringToPath<T extends string> = T extends ''
  ? []
  : T extends `[${infer Head}].${infer Tail}`
    ? [Head, ...StringToPath<Tail>]
    : T extends `.${infer Head}${infer Tail}`
      ? [Head, ...StringToPath<Tail>]
      : T extends `${infer Head}${infer Tail}`
        ? [Head, ...StringToPath<Tail>]
        : [T];
