type TestObj =
  | (() => void)
  | { a: string }
  | Array<number>
  | Date
  | Error
  | Promise<number>
  | boolean
  | null
  | number
  | string
  | undefined;

export function typesDataProvider(
  t:
    | 'array'
    | 'boolean'
    | 'date'
    | 'error'
    | 'function'
    | 'null'
    | 'number'
    | 'object'
    | 'promise'
    | 'string'
    | 'undefined',
): TestObj {
  switch (t) {
    case 'number':
      return 5;
    case 'array':
      return [1, 2, 3];
    case 'boolean':
      return false;
    case 'date':
      return new Date();
    case 'function':
      return () => {
        /* (intentionally empty) */
      };
    case 'null':
      return null;
    case 'promise':
      return Promise.resolve(5);
    case 'string':
      return 'text';
    case 'object':
      return { a: 'asd' };
    case 'error':
      return new Error('asd');
    case 'undefined':
      return undefined;
  }
}
