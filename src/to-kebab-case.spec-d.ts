import { expectTypeOf, it } from 'vitest';
import { toKebabCase } from './to-kebab-case';

it('primitive string', () => {
  const result = toKebabCase('hello world' as string);

  expectTypeOf(result).toEqualTypeOf<string>();
});

it('empty string', () => {
  const result = toKebabCase('' as const);

  expectTypeOf(result).toEqualTypeOf<''>();
});

it('camelCase', () => {
  const result = toKebabCase('helloWorld' as const);

  expectTypeOf(result).toEqualTypeOf<'hello-world'>();
});

it('spaces and mixed cases', () => {
  const result = toKebabCase('Hello World' as const);

  expectTypeOf(result).toEqualTypeOf<'hello-world'>();
});

it('spaces and lower case', () => {
  const result = toKebabCase('hello world' as const);

  expectTypeOf(result).toEqualTypeOf<'hello-world'>();
});

it('spaces and UPPERCASE', () => {
  const result = toKebabCase('HELLO WORLD' as const);

  expectTypeOf(result).toEqualTypeOf<'hello-world'>();
});

it('snake_case', () => {
  const result = toKebabCase('hello_world' as const);

  expectTypeOf(result).toEqualTypeOf<'hello-world'>();
});

it('kebab-case', () => {
  const result = toKebabCase('hello-world' as const);

  expectTypeOf(result).toEqualTypeOf<'hello-world'>();
});

it('string with multiple delimiters', () => {
  const result = toKebabCase('foo---bar' as const);

  expectTypeOf(result).toEqualTypeOf<'foo-bar'>();
});

it('numbers', () => {
  const result = toKebabCase('helloWorld123' as const);

  expectTypeOf(result).toEqualTypeOf<'hello-world-123'>();
});

it('string with special characters', () => {
  const result = toKebabCase('hello@world!' as const);

  expectTypeOf(result).toEqualTypeOf<'hello-@world-!'>();
});
