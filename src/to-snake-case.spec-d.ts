import { expectTypeOf, it } from 'vitest';
import { toSnakeCase } from './to-snake-case';

it('primitive string', () => {
  const result = toSnakeCase('hello world' as string);

  expectTypeOf(result).toEqualTypeOf<string>();
});

it('empty string', () => {
  const result = toSnakeCase('' as const);

  expectTypeOf(result).toEqualTypeOf<''>();
});

it('camelCase', () => {
  const result = toSnakeCase('helloWorld' as const);

  expectTypeOf(result).toEqualTypeOf<'hello_world'>();
});

it('spaces and mixed cases', () => {
  const result = toSnakeCase('Hello World' as const);

  expectTypeOf(result).toEqualTypeOf<'hello_world'>();
});

it('spaces and lower case', () => {
  const result = toSnakeCase('hello world' as const);

  expectTypeOf(result).toEqualTypeOf<'hello_world'>();
});

it('spaces and UPPERCASE', () => {
  const result = toSnakeCase('HELLO WORLD' as const);

  expectTypeOf(result).toEqualTypeOf<'hello_world'>();
});

it('snake_case', () => {
  const result = toSnakeCase('hello_world' as const);

  expectTypeOf(result).toEqualTypeOf<'hello_world'>();
});

it('kebab-case', () => {
  const result = toSnakeCase('hello-world' as const);

  expectTypeOf(result).toEqualTypeOf<'hello_world'>();
});

it('string with multiple delimiters', () => {
  const result = toSnakeCase('foo___bar' as const);

  expectTypeOf(result).toEqualTypeOf<'foo_bar'>();
});

it('numbers', () => {
  const result = toSnakeCase('helloWorld123' as const);

  expectTypeOf(result).toEqualTypeOf<'hello_world_123'>();
});

it('string with special characters', () => {
  const result = toSnakeCase('hello@world!' as const);

  expectTypeOf(result).toEqualTypeOf<'hello_@world_!'>();
});
