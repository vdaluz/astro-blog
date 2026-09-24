import { test } from 'node:test';
import assert from 'node:assert/strict';
import { postHref, normalizeBase, pageHref } from '../src/lib/post-href.ts';

test('postHref omits a trailing slash by default', () => {
  assert.equal(postHref('/blog', 'my-post'), '/blog/my-post');
});

test('postHref appends a trailing slash when trailingSlash is true', () => {
  assert.equal(postHref('/blog', 'my-post', true), '/blog/my-post/');
});

test('postHref omits a trailing slash when trailingSlash is explicitly false', () => {
  assert.equal(postHref('/blog', 'my-post', false), '/blog/my-post');
});

test('postHref strips a trailing slash from base instead of doubling it', () => {
  assert.equal(postHref('/blog/', 'my-post'), '/blog/my-post');
});

test('postHref collapses multiple trailing slashes from base', () => {
  assert.equal(postHref('/blog//', 'my-post'), '/blog/my-post');
});

test('postHref on a root-mounted blog (base="/") produces a local path, not a protocol-relative URL', () => {
  assert.equal(postHref('/', 'my-post'), '/my-post');
});

test('normalizeBase strips trailing slashes', () => {
  assert.equal(normalizeBase('/blog/'), '/blog');
  assert.equal(normalizeBase('/blog//'), '/blog');
  assert.equal(normalizeBase('/blog'), '/blog');
});

test('normalizeBase("/") returns an empty string - the contract pageHref\'s root-mount case relies on', () => {
  assert.equal(normalizeBase('/'), '');
});

test('pageHref maps page 1 on a root-mounted blog to "/"', () => {
  assert.equal(pageHref('/', 1), '/');
});

test('pageHref never appends a slash to the root-mounted page 1', () => {
  assert.equal(pageHref('/', 1, true), '/');
});

test('pageHref builds numbered pages on a root-mounted blog', () => {
  assert.equal(pageHref('/', 2, true), '/2/');
});

test('pageHref maps page 1 to the normalized base', () => {
  assert.equal(pageHref('/blog/', 1), '/blog');
});

test('pageHref appends a trailing slash to page 1 when trailingSlash is true', () => {
  assert.equal(pageHref('/blog', 1, true), '/blog/');
});

test('pageHref builds numbered pages under base with a trailing slash', () => {
  assert.equal(pageHref('/blog', 3, true), '/blog/3/');
});
