import { test } from 'node:test';
import assert from 'node:assert/strict';
import { postHref, normalizeBase } from '../src/lib/post-href.ts';

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

test('normalizeBase("/") returns an empty string - the contract Pagination\'s root-mount case relies on', () => {
  assert.equal(normalizeBase('/'), '');
});
