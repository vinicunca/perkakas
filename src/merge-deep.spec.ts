import { describe, expect, it } from 'vitest';
import { doNothing } from './do-nothing';
import { mergeDeep } from './merge-deep';

describe('runtime (dataFirst)', () => {
  it('should merge objects', () => {
    const a = { foo: 'baz', x: 1 };
    const b = { foo: 'bar', y: 2 };

    expect(mergeDeep(a, b)).toStrictEqual({ foo: 'bar', x: 1, y: 2 });
  });

  it('should merge nested objects', () => {
    const a = { foo: { bar: 'baz' } };
    const b = { foo: { qux: 'quux' } };

    expect(mergeDeep(a, b)).toStrictEqual({ foo: { bar: 'baz', qux: 'quux' } });
  });

  it('should not merge object and array', () => {
    const a = { foo: ['qux'] };
    const b = { foo: { bar: 'baz' } };

    expect(mergeDeep(a, b)).toStrictEqual({ foo: { bar: 'baz' } });
  });

  it('should not merge array and object', () => {
    const a = { foo: { bar: 'baz' } };
    const b = { foo: ['qux'] };

    expect(mergeDeep(a, b)).toStrictEqual({ foo: ['qux'] });
  });

  it('should not merge arrays', () => {
    const a = { foo: ['bar'] };
    const b = { foo: ['baz'] };

    expect(mergeDeep(a, b)).toStrictEqual({ foo: ['baz'] });
  });

  it('should merge different types', () => {
    const a = { foo: 'bar' };
    const b = { foo: 123 };

    expect(mergeDeep(a, b)).toStrictEqual({ foo: 123 });
  });

  it('should work with weird object types, null', () => {
    const a = { foo: null };
    const b = { foo: 123 };

    expect(mergeDeep(a, b)).toStrictEqual({ foo: 123 });
    expect(mergeDeep(b, a)).toStrictEqual({ foo: null });
  });

  it('should work with weird object types, functions', () => {
    const a = { foo: doNothing() };
    const b = { foo: 123 };

    expect(mergeDeep(a, b)).toStrictEqual({ foo: 123 });
    expect(mergeDeep(b, a)).toStrictEqual({ foo: doNothing() });
  });

  it('should work with weird object types, date', () => {
    const a = { foo: new Date(1337) };
    const b = { foo: 123 };

    expect(mergeDeep(a, b)).toStrictEqual({ foo: 123 });
    expect(mergeDeep(b, a)).toStrictEqual({ foo: new Date(1337) });
  });

  it('doesn\'t spread arrays', () => {
    const a = { foo: ['bar'] };
    const b = { foo: ['baz'] };

    expect(mergeDeep(a, b)).toStrictEqual({ foo: ['baz'] });
  });

  it('doesn\'t recurse into arrays', () => {
    const a = { foo: [{ bar: 'baz' }] };
    const b = { foo: [{ bar: 'hello, world' }] };

    expect(mergeDeep(a, b)).toStrictEqual({ foo: [{ bar: 'hello, world' }] });
  });
});

describe('runtime (dataLast)', () => {
  it('should merge objects', () => {
    const a = { foo: 'baz', x: 1 };
    const b = { foo: 'bar', y: 2 };

    expect(mergeDeep(b)(a)).toStrictEqual({ foo: 'bar', x: 1, y: 2 });
  });
});
