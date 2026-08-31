import { test } from 'node:test';
import assert from 'node:assert/strict';
import { postHref } from '../src/lib/post-href.ts';

test('postHref omits a trailing slash by default', () => {
  assert.equal(postHref('/blog', 'my-post'), '/blog/my-post');
});

test('postHref appends a trailing slash when trailingSlash is true', () => {
  assert.equal(postHref('/blog', 'my-post', true), '/blog/my-post/');
});

test('postHref omits a trailing slash when trailingSlash is explicitly false', () => {
  assert.equal(postHref('/blog', 'my-post', false), '/blog/my-post');
});
