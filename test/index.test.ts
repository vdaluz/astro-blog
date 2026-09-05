import { test } from 'node:test';
import assert from 'node:assert/strict';

test('the package entry resolves under Node and exposes exactly its documented value exports', async () => {
  const barrel = await import('../src/index.ts');
  assert.deepEqual(
    Object.keys(barrel).sort(),
    [
      'BUILT_IN_LOCALES',
      'blogSchema',
      'buildBlogPostingSchema',
      'buildRssItems',
      'filterPostsByTag',
      'formatDate',
      'normalizeTag',
      'postHref',
      'scoreRelated',
      'serializeForScriptTag',
      'shikiConfig',
      't',
    ].sort(),
  );
});
