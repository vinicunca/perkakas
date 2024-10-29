import type { DocumentedFunction } from './perkakas.transform';

export function getTags({
  methods: [method],
}: DocumentedFunction): ReadonlyArray<string> {
  const { indexed = false, pipeable = false, strict = false } = method ?? {};

  const out = [];

  if (pipeable) {
    out.push('pipeable');
  }

  if (indexed) {
    out.push('indexed');
  }

  if (strict) {
    out.push('strict');
  }

  return out;
}
