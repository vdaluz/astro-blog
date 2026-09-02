import { test } from 'node:test';
import assert from 'node:assert/strict';
import { remarkReadingTime } from '../src/lib/remark-reading-time.ts';

function words(count: number): string {
  return Array.from({ length: count }, (_, i) => `w${i}`).join(' ');
}

function textNode(value: string) {
  return { type: 'text', value };
}

function paragraph(...children: unknown[]) {
  return { type: 'paragraph', children };
}

function tree(...children: unknown[]) {
  return { type: 'root', children };
}

function run(root: ReturnType<typeof tree>, file: Record<string, unknown> = {}) {
  remarkReadingTime()(root as never, file as never);
  return file as {
    data?: { astro?: { frontmatter?: { minutesRead?: number; [key: string]: unknown } } };
  };
}

test('200 words rounds up to 1 minute', () => {
  const file = run(tree(paragraph(textNode(words(200)))));
  assert.equal(file.data?.astro?.frontmatter?.minutesRead, 1);
});

test('201 words rounds up to 2 minutes', () => {
  const file = run(tree(paragraph(textNode(words(201)))));
  assert.equal(file.data?.astro?.frontmatter?.minutesRead, 2);
});

test('400 words rounds up to 2 minutes', () => {
  const file = run(tree(paragraph(textNode(words(400)))));
  assert.equal(file.data?.astro?.frontmatter?.minutesRead, 2);
});

test('401 words rounds up to 3 minutes', () => {
  const file = run(tree(paragraph(textNode(words(401)))));
  assert.equal(file.data?.astro?.frontmatter?.minutesRead, 3);
});

test('zero words still reads as 1 minute (Math.max floor)', () => {
  const file = run(tree(paragraph()));
  assert.equal(file.data?.astro?.frontmatter?.minutesRead, 1);
});

test('an empty-string value node contributes no words and still floors to 1 minute', () => {
  const file = run(tree(paragraph(textNode(''))));
  assert.equal(file.data?.astro?.frontmatter?.minutesRead, 1);
});

test('counts code block and inline code text toward the total, matching the type-agnostic collector', () => {
  // Deliberate: collectText walks every node with a string `value`, code included.
  // Excluding code would need a type-based skip list - a separate design decision,
  // not something this test-coverage pass changes. This test documents the current,
  // intentional behavior as the spec.
  const codeBlock = { type: 'code', value: words(150) };
  const inlineCode = { type: 'inlineCode', value: words(60) };
  const file = run(tree(codeBlock, paragraph(textNode(words(0)), inlineCode)));
  assert.equal(file.data?.astro?.frontmatter?.minutesRead, 2);
});

test('adjacent text nodes join with a space instead of concatenating into one word', () => {
  // 201 separate single-character text nodes. Joined with a space, that's 201
  // words -> 2 minutes. If they were concatenated with no separator instead,
  // the whole tree would collapse into one unbroken token -> 1 word -> 1 minute.
  // Only the correct (space-joined) behavior produces 2 here.
  const chars = Array.from({ length: 201 }, () => textNode('w'));
  const file = run(tree(paragraph(...chars)));
  assert.equal(file.data?.astro?.frontmatter?.minutesRead, 2);
});

test('counts text nested under list > listItem > paragraph via recursion', () => {
  const listItem = { type: 'listItem', children: [paragraph(textNode(words(201)))] };
  const list = { type: 'list', children: [listItem] };
  const file = run(tree(list));
  assert.equal(file.data?.astro?.frontmatter?.minutesRead, 2);
});

test('initializes file.data.astro.frontmatter from a completely empty file object', () => {
  const file = run(tree(paragraph(textNode('hi'))), {});
  assert.deepEqual(file.data?.astro?.frontmatter, { minutesRead: 1 });
});

test('preserves an existing sibling key under file.data', () => {
  const file = run(tree(paragraph(textNode('hi'))), { data: { other: 1 } });
  assert.equal((file.data as unknown as { other: number }).other, 1);
  assert.equal(file.data?.astro?.frontmatter?.minutesRead, 1);
});

test('preserves pre-existing frontmatter fields instead of clobbering them - the production case, since Astro already populates file.data.astro.frontmatter before remark plugins run', () => {
  const file = run(tree(paragraph(textNode(words(201)))), {
    data: { astro: { frontmatter: { title: 'My Post', tags: ['a', 'b'] } } },
  });
  assert.equal(file.data?.astro?.frontmatter?.title, 'My Post');
  assert.deepEqual(file.data?.astro?.frontmatter?.tags, ['a', 'b']);
  assert.equal(file.data?.astro?.frontmatter?.minutesRead, 2);
});
