export function toLazyIndexed<T>(fn: T): T & { indexed: true } {
  (fn as any).indexed = true;
  return fn as any;
}
