export type LazyResult<T> = LazyEmpty | LazyMany<T> | LazyNext<T>;

interface LazyEmpty {
  done: boolean;
  hasNext: false;
  hasMany?: false | undefined;
  next?: undefined;
}

interface LazyNext<T> {
  done: boolean;
  hasNext: true;
  hasMany?: false | undefined;
  next: T;
}

interface LazyMany<T> {
  done: boolean;
  hasNext: true;
  hasMany: true;
  next: ReadonlyArray<T>;
}
