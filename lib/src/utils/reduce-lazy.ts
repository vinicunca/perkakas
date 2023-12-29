export type LazyResult<T> = LazyEmpty | LazyMany<T> | LazyNext<T>;

interface LazyEmpty {
  done: boolean;
  hasMany?: false | undefined;
  hasNext: false;
  next?: undefined;
}

interface LazyNext<T> {
  done: boolean;
  hasMany?: false | undefined;
  hasNext: true;
  next: T;
}

interface LazyMany<T> {
  done: boolean;
  hasMany: true;
  hasNext: true;
  next: Array<T>;
}

export function _reduceLazy<T, K>(
  array: Array<T>,
  lazy: (item: T, index?: number, array?: Array<T>) => LazyResult<K>,
  indexed?: boolean,
): Array<K> {
  const newArray: Array<K> = [];
  // Use for loop here instead of reduce for performance reasons. See https://leanylabs.com/blog/js-forEach-map-reduce-vs-for-for_of/ for more info
  for (let index = 0; index < array.length; index++) {
    const item = array[index];
    const result = indexed ? lazy(item, index, array) : lazy(item);
    if (result.hasMany === true) {
      newArray.push(...result.next);
    } else if (result.hasNext) {
      newArray.push(result.next);
    }
  }
  return newArray;
}
