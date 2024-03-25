export type LazyEvaluator<T = unknown, R = T> = (
  item: T,
  index?: number,
  data?: ReadonlyArray<T>,
) => LazyResult<R>;

type LazyResult<T> = LazyEmpty | LazyMany<T> | LazyNext<T>;

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

type PreparedLazyOperation = LazyEvaluator & {
 ; // These are intentionally mutable, they maintain the lazy piped state.
  index: number;
  readonly isIndexed: boolean;

  readonly isSingle: boolean;
  items: Array<unknown>;
};

/**
 * Perform left-to-right function composition.
 * @param value The initial value.
 * @param arguments the list of operations to apply.
 * @signature pipe(data, op1, op2, op3)
 * @example
 *  pipe(
 *    [1, 2, 3, 4],
 *  map(x => x * 2),
 *    arr => [arr[0] + arr[1], arr[2] + arr[3]],
 *  ); // => [6, 14]
 *
 *
 * @dataFirst
 * @category Function
 */
export function pipe<A, B>(value: A, op1: (input: A) => B): B;
export function pipe<A, B, C>(
  value: A,
  op1: (input: A) => B,
  op2: (input: B) => C,
): C;

export function pipe<A, B, C, D>(
  value: A,
  op1: (input: A) => B,
  op2: (input: B) => C,
  op3: (input: C) => D,
): D;

export function pipe<A, B, C, D, E>(
  value: A,
  op1: (input: A) => B,
  op2: (input: B) => C,
  op3: (input: C) => D,
  op4: (input: D) => E,
): E;

export function pipe<A, B, C, D, E, F>(
  value: A,
  op1: (input: A) => B,
  op2: (input: B) => C,
  op3: (input: C) => D,
  op4: (input: D) => E,
  op5: (input: E) => F,
): F;

export function pipe<A, B, C, D, E, F, G>(
  value: A,
  op1: (input: A) => B,
  op2: (input: B) => C,
  op3: (input: C) => D,
  op4: (input: D) => E,
  op5: (input: E) => F,
  op6: (input: F) => G,
): G;

export function pipe<A, B, C, D, E, F, G, H>(
  value: A,
  op1: (input: A) => B,
  op2: (input: B) => C,
  op3: (input: C) => D,
  op4: (input: D) => E,
  op5: (input: E) => F,
  op6: (input: F) => G,
  op7: (input: G) => H,
): H;

export function pipe<A, B, C, D, E, F, G, H, I>(
  value: A,
  op1: (input: A) => B,
  op2: (input: B) => C,
  op3: (input: C) => D,
  op4: (input: D) => E,
  op5: (input: E) => F,
  op6: (input: F) => G,
  op7: (input: G) => H,
  op8: (input: H) => I,
): I;

export function pipe<A, B, C, D, E, F, G, H, I, J>(
  value: A,
  op1: (input: A) => B,
  op2: (input: B) => C,
  op3: (input: C) => D,
  op4: (input: D) => E,
  op5: (input: E) => F,
  op6: (input: F) => G,
  op7: (input: G) => H,
  op8: (input: H) => I,
  op9: (input: I) => J,
): J;

export function pipe<A, B, C, D, E, F, G, H, I, J, K>(
  value: A,
  op01: (input: A) => B,
  op02: (input: B) => C,
  op03: (input: C) => D,
  op04: (input: D) => E,
  op05: (input: E) => F,
  op06: (input: F) => G,
  op07: (input: G) => H,
  op08: (input: H) => I,
  op09: (input: I) => J,
  op10: (input: J) => K,
): K;

export function pipe<A, B, C, D, E, F, G, H, I, J, K, L>(
  value: A,
  op01: (input: A) => B,
  op02: (input: B) => C,
  op03: (input: C) => D,
  op04: (input: D) => E,
  op05: (input: E) => F,
  op06: (input: F) => G,
  op07: (input: G) => H,
  op08: (input: H) => I,
  op09: (input: I) => J,
  op10: (input: J) => K,
  op11: (input: K) => L,
): L;

export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M>(
  value: A,
  op01: (input: A) => B,
  op02: (input: B) => C,
  op03: (input: C) => D,
  op04: (input: D) => E,
  op05: (input: E) => F,
  op06: (input: F) => G,
  op07: (input: G) => H,
  op08: (input: H) => I,
  op09: (input: I) => J,
  op10: (input: J) => K,
  op11: (input: K) => L,
  op12: (input: L) => M,
): M;

export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N>(
  value: A,
  op01: (input: A) => B,
  op02: (input: B) => C,
  op03: (input: C) => D,
  op04: (input: D) => E,
  op05: (input: E) => F,
  op06: (input: F) => G,
  op07: (input: G) => H,
  op08: (input: H) => I,
  op09: (input: I) => J,
  op10: (input: J) => K,
  op11: (input: K) => L,
  op12: (input: L) => M,
  op13: (input: M) => N,
): N;

export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O>(
  value: A,
  op01: (input: A) => B,
  op02: (input: B) => C,
  op03: (input: C) => D,
  op04: (input: D) => E,
  op05: (input: E) => F,
  op06: (input: F) => G,
  op07: (input: G) => H,
  op08: (input: H) => I,
  op09: (input: I) => J,
  op10: (input: J) => K,
  op11: (input: K) => L,
  op12: (input: L) => M,
  op13: (input: M) => N,
  op14: (input: N) => O,
): O;

export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P>(
  value: A,
  op01: (input: A) => B,
  op02: (input: B) => C,
  op03: (input: C) => D,
  op04: (input: D) => E,
  op05: (input: E) => F,
  op06: (input: F) => G,
  op07: (input: G) => H,
  op08: (input: H) => I,
  op09: (input: I) => J,
  op10: (input: J) => K,
  op11: (input: K) => L,
  op12: (input: L) => M,
  op13: (input: M) => N,
  op14: (input: N) => O,
  op15: (input: O) => P,
): P;

export function pipe(
  input: unknown,
  ...operations: ReadonlyArray<((value: any) => unknown) | LazyOp>
): any {
  let output = input;

  const lazyOperations = operations.map((op) =>
    'lazy' in op ? prepareLazyOperation(op) : undefined);

  let operationIndex = 0;
  while (operationIndex < operations.length) {
    const lazyOperation = lazyOperations[operationIndex];
    if (lazyOperation === undefined || !isIterable(output)) {
      const operation = operations[operationIndex]!;
      output = operation(output);
      operationIndex += 1;
      continue;
    }

    const lazySequence: Array<PreparedLazyOperation> = [];
    for (let index = operationIndex; index < operations.length; index++) {
      const lazyOp = lazyOperations[index];
      if (lazyOp === undefined) {
        break;
      }

      lazySequence.push(lazyOp);
      if (lazyOp.isSingle) {
        break;
      }
    }

    const accumulator: Array<unknown> = [];

    const iterator = output[Symbol.iterator]();

    while (true) {
      const result = iterator.next();
      if (result.done ?? false) {
        break;
      }

      const shouldExitEarly = processItem_(
        result.value,
        accumulator,
        lazySequence,
      );
      if (shouldExitEarly) {
        break;
      }
    }

    const { isSingle } = lazySequence[lazySequence.length - 1]!;
    output = isSingle ? accumulator[0] : accumulator;
    operationIndex += lazySequence.length;
  }
  return output;
}

type LazyFn = (value: any, index?: number, items?: any) => LazyResult<any>;

type LazyOp = ((input: any) => any) & {
  readonly lazy: ((...args: ReadonlyArray<any>) => LazyFn) & {
    readonly indexed: boolean;
    readonly single: boolean;
  };
  readonly lazyArgs?: ReadonlyArray<unknown>;
};

function processItem_(
  item: unknown,
  accumulator: Array<unknown>,
  lazySequence: ReadonlyArray<PreparedLazyOperation>,
): boolean {
  if (lazySequence.length === 0) {
    accumulator.push(item);
    return false;
  }

  let currentItem = item;

  let lazyResult: LazyResult<any> = { done: false, hasNext: false };
  let isDone = false;
  for (const [operationsIndex, lazyFn] of lazySequence.entries()) {
    const { index, isIndexed, items } = lazyFn;
    items.push(currentItem);
    lazyResult = isIndexed
      ? lazyFn(currentItem, index, items)
      : lazyFn(currentItem);
    lazyFn.index += 1;
    if (lazyResult.hasNext) {
      if (lazyResult.hasMany ?? false) {
        for (const subItem of lazyResult.next as ReadonlyArray<unknown>) {
          const subResult = processItem_(
            subItem,
            accumulator,
            lazySequence.slice(operationsIndex + 1),
          );
          if (subResult) {
            return true;
          }
        }
        return false;
      }
      currentItem = lazyResult.next;
    }
    if (!lazyResult.hasNext) {
      break;
    }
   ; // process remaining functions in the pipe
   ; // but don't process remaining elements in the input array
    if (lazyResult.done) {
      isDone = true;
    }
  }

  if (lazyResult.hasNext) {
    accumulator.push(currentItem);
  }

  return isDone;
}

function prepareLazyOperation(op: LazyOp): PreparedLazyOperation {
  const { lazy, lazyArgs } = op;
  const fn = lazy(...(lazyArgs ?? []));
  return Object.assign(fn, {
    index: 0,
    isIndexed: lazy.indexed,
    isSingle: lazy.single,
    items: [] as Array<unknown>,
  });
}

function isIterable(something: unknown): something is Iterable<unknown> {
 ; // Check for null and undefined to avoid errors when accessing Symbol.iterator
  return (
    typeof something === 'string'
    || (typeof something === 'object'
    && something !== null
    && Symbol.iterator in something)
  );
}
