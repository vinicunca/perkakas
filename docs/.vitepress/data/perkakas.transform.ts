import type { SetRequired } from 'type-fest';

import type { JSONOutput } from 'typedoc';
import type PERKAKAS_METADATA from './metadata.json';
import { hasAtLeast, isDefined, uniqueBy } from '@vinicunca/perkakas';

import invariant from 'tiny-invariant';
import { ReflectionKind } from 'typedoc';

export type DocumentedFunction = ReturnType<typeof transformProject>[number];
export type FunctionSignature = ReturnType<typeof transformSignature>;
export type FunctionParam = ReturnType<typeof getParameter>;
export type FunctionReturn = ReturnType<typeof transformReturns>;

export type SourceTags = Readonly<
  Partial<Record<'indexed' | 'lazy' | 'pipeable' | 'strict', boolean>>
>;

export function transformProject(project: typeof PERKAKAS_METADATA) {
  const { children } = project;
  invariant(children !== undefined, 'The typedoc output is empty!');

  const functions = children.filter(
    ({ kind }) => kind === ReflectionKind.Function,
  );

  const functionNames = new Set(functions.map(({ name }) => name));

  return addCategories(
    project,
    functions
      .map((func) => transformFunction(func, functionNames))
      .filter(isDefined),
  );
}

function transformFunction(
  { id, name, signatures, sources }: JSONOutput.DeclarationReflection,
  functionNames: Set<string>,
) {
  if (signatures === undefined) {
    return;
  }

  const signaturesWithComments = signatures.filter(hasComment);
  if (!hasAtLeast(signaturesWithComments, 1)) {
    return;
  }

  const [
    {
      comment: { summary },
    },
  ] = signaturesWithComments;
  const description
    = summary.length === 0
      ? undefined
      : summary
          .map((part) => transformCommentDisplayPart(part, functionNames))
          .join('');

  const methods = uniqueBy(
    signaturesWithComments.map(transformSignature),
    ({ signature }) => signature,
  );

  const sourceUrl = sources?.[0]?.url;

  return { description, id, methods, name, sourceUrl };
}

function transformCommentDisplayPart(
  { kind, text }: JSONOutput.CommentDisplayPart,
  functionNames: ReadonlySet<string>,
): string {
  if (kind !== 'code') {
    return text;
  }
  const codeContent = text.slice(1, -1);
  // If this is a function name, link to its anchor:
  return functionNames.has(codeContent) ? `[${text}](#${codeContent})` : text;
}

function transformSignature(signature: SetRequired<JSONOutput.SignatureReflection, 'comment'>) {
  return {
    ...transformComment(signature.comment),
    args: transformArgs(signature.parameters),
    returns: transformReturns(signature),
  } as const;
}

function transformComment(comment: JSONOutput.Comment) {
  return {
    example: tagContent(comment, 'example'),
    signature: tagContent(comment, 'signature'),
    tag: getFunctionCurriedVariant(comment),
    ...extractTags(comment),
  } as const;
}

function extractTags(comment: JSONOutput.Comment): SourceTags {
  return {
    lazy: hasTag(comment, 'lazy'),
  } as const;
}

function transformArgs(
  parameters: Array<JSONOutput.ParameterReflection> | undefined,
) {
  return parameters?.map(getParameter) ?? [];
}

function transformReturns({
  comment,
  type,
}: SetRequired<JSONOutput.SignatureReflection, 'comment'>) {
  return ({
    description: tagContent(comment, 'returns'),
    name: getReturnType(type),
  }) as const;
}

function getFunctionCurriedVariant(comment: JSONOutput.Comment) {
  if (hasTag(comment, 'dataFirst')) {
    return 'Data First';
  }

  if (hasTag(comment, 'dataLast')) {
    return 'Data Last';
  }
}

function hasComment(
  item: JSONOutput.SignatureReflection,
): item is SetRequired<JSONOutput.SignatureReflection, 'comment'> {
  return item.comment !== undefined;
}

function getReturnType(type: JSONOutput.SomeType | undefined) {
  if (!isDefined(type)) {
    return 'Object';
  }

  if (type.type === 'intrinsic') {
    return type.name;
  }

  if (type.type === 'array') {
    return 'Array';
  }

  if (type.type === 'predicate') {
    return 'boolean';
  }

  return 'Object';
}

function getParameter({ comment, name }: JSONOutput.ParameterReflection) {
  const summarySegments = comment?.summary ?? [];
  return {
    description:
      summarySegments.length === 0
        ? undefined
        : summarySegments.map(({ text }) => text).join(''),
    name,
  } as const;
}

function hasTag({ blockTags }: JSONOutput.Comment, tagName: string): boolean {
  return blockTags === undefined
    ? false
    : blockTags.some(({ tag }) => tag === `@${tagName}`);
}

function tagContent(
  { blockTags }: JSONOutput.Comment,
  tagName: string,
): string | undefined {
  if (blockTags === undefined) {
    return;
  }

  const tag = blockTags.find(({ tag }) => tag === `@${tagName}`);

  if (tag === undefined) {
    return;
  }

  const { content } = tag;
  if (content.length === 0) {
    return undefined;
  }

  return content.map(({ text }) => text).join('');
}

function addCategories(
  { categories }: JSONOutput.ProjectReflection,
  functions: ReadonlyArray<NonNullable<ReturnType<typeof transformFunction>>>,
) {
  invariant(
    categories !== undefined,
    'Category data is missing from typedoc output!',
  );
  const categoriesLookup = createCategoriesLookup(categories);
  return functions.map(({ id, ...item }) => ({
    ...item,
    category: categoriesLookup.get(id),
  }));
}

function createCategoriesLookup(
  categories: ReadonlyArray<JSONOutput.ReflectionCategory>,
): ReadonlyMap<number, string> {
  const result = new Map<number, string>();

  for (const { children, title } of categories) {
    if (children === undefined) {
      continue;
    }

    // TODO: We can enforce that only a predefined set of categories is
    // acceptable and break the build on any unknown categories
    for (const id of children) {
      result.set(id, title);
    }
  }

  return result;
}
