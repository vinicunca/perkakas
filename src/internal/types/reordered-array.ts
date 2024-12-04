import type { IterableContainer } from './iterable-container';

export type ReorderedArray<T extends IterableContainer> = {
  -readonly [P in keyof T]: T[number];
};
