/**
 * This script takes the JSON output of typedoc and reformats and transforms it
 * to what our site needs in order to render the functions page.
 */
import process from 'node:process';
import fs from 'node:fs/promises';
import {
  type Options as PrettierOptions,
  format as prettierFormat,
} from 'prettier';
import invariant from 'tiny-invariant';
import { type SetRequired } from 'type-fest';
import { type JSONOutput, ReflectionKind } from 'typedoc';
import { isDefined, isEmpty, toKebabCase } from '@vinicunca/perkakas';

const PRETTIER_OPTIONS = {
  parser: 'typescript',
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
} satisfies PrettierOptions;

main()
  .then(() => {
    console.log('✅ Done!');
  })
  .catch((e) => {
    console.log('💩 The process threw an error!', e);
    process.exit(1);
  });

async function main(): Promise<void> {
  const jsonData = await fs.readFile('docs/build/out.json', 'utf8');
  const data = JSON.parse(jsonData) as unknown as JSONOutput.ProjectReflection;

  const output = await transformProject(data);

  const jsonOutput = JSON.stringify(output, null, 2);
  await fs.writeFile('docs/build/data.json', jsonOutput);

  await generateDocFiles(output);
}

async function transformProject(project: JSONOutput.ProjectReflection) {
  const { children } = project;
  invariant(isDefined(children), 'The typedoc output is empty!');

  const functions = await Promise.all(
    children
      .filter(({ kind }) => kind === ReflectionKind.Function)
      .map(transformFunction),
  );

  return addCategories(project, functions.filter(isDefined));
}

async function transformFunction({
  id,
  name,
  signatures,
}: JSONOutput.DeclarationReflection) {
  console.log('processing', name);

  if (signatures === undefined) {
    return;
  }

  const signaturesWithComments = signatures.filter(hasComment);

  if (isEmpty(signaturesWithComments)) {
    return;
  }

  const summary = signaturesWithComments[0]!.comment.summary;
  const description
    = summary.length === 0
      ? undefined
      : summary.map(({ text }) => text).join('');

  const badges = getBadges(signaturesWithComments[0]!.comment);

  const methods = await Promise.all(
    signaturesWithComments.map(transformSignature),
  );

  return { id, name, badges, description, methods };
}

async function transformSignature({
  comment,
  parameters = [],
  type,
}: SetRequired<JSONOutput.SignatureReflection, 'comment'>) {
  return {
    tag: getFunctionCurriedVariant(comment),
    signature: await getFunctionSignature(comment),
    example: await getExample(comment),
    args: parameters.map(getParameter),
    returns: {
      name: getReturnType(type),
      description: tagContent(comment, 'returns'),
    },
  };
}

function getBadges(comment: JSONOutput.Comment): string[] {
  const badges: string[] = [];

  if (hasTag(comment, 'indexed')) {
    badges.push('indexed');
  }

  if (hasTag(comment, 'pipeable')) {
    badges.push('pipeable');
  }

  if (hasTag(comment, 'strict')) {
    badges.push('strict');
  }

  return badges;
}

function getFunctionCurriedVariant(comment: JSONOutput.Comment) {
  if (hasTag(comment, 'dataFirst')) {
    return 'Data First';
  }

  if (hasTag(comment, 'dataLast')) {
    return 'Data Last';
  }

  return undefined;
}

function hasComment(
  item: JSONOutput.SignatureReflection,
): item is SetRequired<JSONOutput.SignatureReflection, 'comment'> {
  return isDefined(item.comment);
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

async function getExample(
  comment: JSONOutput.Comment,
): Promise<string | undefined> {
  const example = tagContent(comment, 'example');
  if (isDefined(example)) {
    return prettierFormat(example, PRETTIER_OPTIONS);
  }

  const exampleRaw = tagContent(comment, 'exampleRaw');
  return exampleRaw
    ?.split('\n')
    .map((str) => str.replace(/^ {3}/, ''))
    .join('\n');
}

function getParameter({ name, comment }: JSONOutput.ParameterReflection) {
  const summarySegments = comment?.summary ?? [];
  return {
    name,
    description:
      summarySegments.length === 0
        ? undefined
        : summarySegments.map(({ text }) => text).join(''),
  };
}

async function getFunctionSignature(
  comment: JSONOutput.Comment,
): Promise<string | undefined> {
  const signatureRaw = tagContent(comment, 'signature');

  if (!isDefined(signatureRaw)) {
    return;
  }

  return prettierFormat(signatureRaw, PRETTIER_OPTIONS);
}

function hasTag({ blockTags }: JSONOutput.Comment, tagName: string): boolean {
  return !isDefined(blockTags)
    ? false
    : blockTags.some(({ tag }) => tag === `@${tagName}`);
}

function tagContent(
  { blockTags }: JSONOutput.Comment,
  tagName: string,
): string | undefined {
  if (!isDefined(blockTags)) {
    return;
  }

  const tag = blockTags.find(({ tag }) => tag === `@${tagName}`);

  if (!isDefined(tag)) {
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
  functions: ReadonlyArray<
  NonNullable<Awaited<ReturnType<typeof transformFunction>>>
  >,
) {
  invariant(
    isDefined(categories),
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
    if (!isDefined(children)) {
      continue;
    }

    for (const id of children) {
      result.set(id, title);
    }
  }

  return result;
}

async function generateDocFiles(inputs: Awaited<ReturnType<typeof transformProject>>) {
  const promises: any[] = [];

  // for (let idx = 0; idx < inputs.length; idx++) {
  for (let idx = 0; idx < inputs.slice(0, 1).length; idx++) {
    const input = inputs[idx]!;

    const methodContent = input.methods.map((method) => {
      return `
## ${method.tag}

\`\`\`js [light]
${method.signature}\`\`\`

:docs-parameters{ :params='${JSON.stringify(method.args)}' :returns='${JSON.stringify(method.returns)}' }

\`\`\`js
${method.example}\`\`\``;
    });

    const content = `# ${input.name}

${input.description ?? ''}

:docs-badges{ :badges='${JSON.stringify(input.badges)}' }

${methodContent.join('\n')}`;

    promises.push(fs.writeFile(`docs/content/${idx + 1}.${toKebabCase(input.name)}.md`, content));
  }

  await Promise.all(promises);
}
