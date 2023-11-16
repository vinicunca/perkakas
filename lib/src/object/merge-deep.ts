import { isObject } from '../guard/is-object';

export type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> };

/**
 * Deep merge two objects
 */
export function mergeDeep<T>({
  mergeArray = false,
  original,
  patch,
}: {
  mergeArray?: boolean;
  original: T;
  patch: DeepPartial<T>;
}): T {
  const original_ = original as any;
  const patch_ = patch as any;

  if (Array.isArray(patch_)) {
    if (mergeArray && Array.isArray(patch_)) {
      return [...original_, ...patch_] as any;
    } else {
      return [...patch_] as any;
    }
  }

  const output = { ...original_ };

  if (isObject(original_) && isObject(patch_)) {
    Object.keys(patch_).forEach((key) => {
      const areBothObjects = isObject(original_[key]) && isObject(patch_[key]);
      const areBothArrays = Array.isArray(original_[key]) && Array.isArray(patch_[key]);

      if ((areBothObjects || areBothArrays)) {
        output[key] = mergeDeep({
          mergeArray,
          original: original_[key],
          patch: patch_[key],
        });
      } else {
        Object.assign(output, { [key]: patch_[key] });
      };
    });
  }

  return output;
}
