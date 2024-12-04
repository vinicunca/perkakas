import type { IterableContainer } from './internal/types/iterable-container';

import { curry } from './curry';

/**
 * Basic structure of `evolver` parameter of the function `evolve`.
 */
type GenericEvolver = {
  readonly [P in string]: ((data: unknown) => unknown) | GenericEvolver;
};

/**
 * Creates an assumed `evolver` type from the type of `data` argument.
 *
 * @example
 * interface Data {
 *   id: number;
 *   quartile: Array<number>;
 *   time?: { elapsed: number; remaining?: number };
 * }
 * type Nested = Evolver<Data>; //  => type Nested = {
 * //   id?: ((data: number) => unknown) | undefined;
 * //   quartile?: ((data: number[]) => unknown) | undefined;
 * //   time?:
 * //     | ((data: { elapsed: number; remaining?: number | undefined }) => unknown)
 * //     | {
 * //         elapsed?: ((data: number) => unknown) | undefined;
 * //         remaining?: ((data: number) => unknown) | undefined;
 * //       }
 * //     | undefined;
 * // };
 */
type Evolver<T> = T extends object
  ? T extends IterableContainer
    ? never
    : {
        readonly [K in keyof T]?: K extends symbol
          ? never
          : ((data: Required<T>[K]) => unknown) | Evolver<T[K]>;
      }
  : never;

/**
 * Creates return type from the type of arguments of `evolve`.
 */
type Evolved<T, E> = T extends object
  ? {
      -readonly [K in keyof T]: K extends keyof E
        ? E[K] extends (
        // eslint-disable-next-line ts/no-explicit-any -- Functions aren't inferred correctly when using `unknown` for the params.
          ...arg: any
        ) => infer R
          ? R
          : Evolved<T[K], E[K]>
        : Required<T>[K];
    }
  : T;

/**
 * Creates a new object by applying functions that is included in `evolver` object parameter
 * to the `data` object parameter according to their corresponding path.
 *
 * Functions included in `evolver` object will not be invoked
 * if its corresponding key does not exist in the `data` object.
 * Also, values included in `data` object will be kept as is
 * if its corresponding key does not exist in the `evolver` object.
 *
 * @param object - Object whose value is applied to the corresponding function
 * that is defined in `evolver` at the same path.
 * @param evolver - Object that include functions that is applied to
 * the corresponding value of `data` object at the same path.
 * @signature
 *    P.evolve(data, evolver)
 * @example
 *    const evolver = {
 *      count: add(1),
 *      time: { elapsed: add(1), remaining: add(-1) },
 *    };
 *    const data = {
 *      id: 10,
 *      count: 10,
 *      time: { elapsed: 100, remaining: 1400 },
 *    };
 *    evolve(data, evolver)
 *    // => {
 *    //   id: 10,
 *    //   count: 11,
 *    //   time: { elapsed: 101, remaining: 1399 },
 *    // }
 * @dataFirst
 * @category Object
 */
export function evolve<T extends object, E extends Evolver<T>>(
  object: T,
  evolver: E,
): Evolved<T, E>;

/**
 * Creates a new object by applying functions that is included in `evolver` object parameter
 * to the `data` object parameter according to their corresponding path.
 *
 * Functions included in `evolver` object will not be invoked
 * if its corresponding key does not exist in the `data` object.
 * Also, values included in `data` object will not be used
 * if its corresponding key does not exist in the `evolver` object.
 *
 * @param evolver - Object that include functions that is applied to
 * the corresponding value of `data` object at the same path.
 * @signature
 *    P.evolve(evolver)(data)
 * @example
 *    const evolver = {
 *      count: add(1),
 *      time: { elapsed: add(1), remaining: add(-1) },
 *    };
 *    const data = {
 *      id: 10,
 *      count: 10,
 *      time: { elapsed: 100, remaining: 1400 },
 *    };
 *    P.pipe(object, P.evolve(evolver))
 *    // => {
 *    //   id: 10,
 *    //   count: 11,
 *    //   time: { elapsed: 101, remaining: 1399 },
 *    // }
 * @dataLast
 * @category Object
 */
export function evolve<T extends object, E extends Evolver<T>>(
  evolver: E,
): (object: T) => Evolved<T, E>;

export function evolve(...args: ReadonlyArray<unknown>): unknown {
  return curry(evolveImplementation, args);
}

function evolveImplementation(data: unknown, evolver: GenericEvolver): unknown {
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  const out: Record<string, unknown> = { ...data };

  for (const [key, value] of Object.entries(evolver)) {
    if (key in out) {
      out[key]
        = typeof value === 'function'
          ? value(out[key])
          : evolveImplementation(out[key], value);
    }
  }

  return out;
}
