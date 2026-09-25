import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildRssItems } from '../src/lib/rss.ts';
import type { BlogPostLike } from '../src/lib/types.ts';

function post(id: string, category: string, tags?: string[]): BlogPostLike {
  return {
    id,
    data: { title: `Title ${id}`, description: `Desc ${id}`, pubDate: new Date(2026, 0, 1), category, tags },
  };
}

test('buildRssItems links posts under the default /blog base', () => {
  const [item] = buildRssItems([post('a', 'homelab')]);
  assert.equal(item.link, '/blog/a');
});

test('buildRssItems still honors the deprecated basePath option', () => {
  const [item] = buildRssItems([post('a', 'homelab')], { basePath: '/posts' });
  assert.equal(item.link, '/posts/a');
});

test('buildRssItems prefers base over the deprecated basePath', () => {
  const [item] = buildRssItems([post('a', 'homelab')], { base: '/new', basePath: '/old' });
  assert.equal(item.link, '/new/a');
});

test('buildRssItems honors a custom base and trims a trailing slash', () => {
  const [item] = buildRssItems([post('a', 'homelab')], { base: '/posts/' });
  assert.equal(item.link, '/posts/a');
});

test('buildRssItems trims repeated trailing slashes from base', () => {
  const [item] = buildRssItems([post('a', 'homelab')], { base: '/posts//' });
  assert.equal(item.link, '/posts/a');
});

test('buildRssItems dedupes category against tags while preserving order', () => {
  const [item] = buildRssItems([post('a', 'homelab', ['homelab', 'docker'])]);
  assert.deepEqual(item.categories, ['homelab', 'docker']);
});

test('buildRssItems handles a post with no tags', () => {
  const [item] = buildRssItems([post('a', 'homelab')]);
  assert.deepEqual(item.categories, ['homelab']);
});

test('buildRssItems maps title, description, and pubDate straight through', () => {
  const p = post('a', 'homelab');
  const [item] = buildRssItems([p]);
  assert.equal(item.title, p.data.title);
  assert.equal(item.description, p.data.description);
  assert.equal(item.pubDate, p.data.pubDate);
});

test('buildRssItems omits a trailing slash by default', () => {
  const [item] = buildRssItems([post('a', 'homelab')]);
  assert.equal(item.link, '/blog/a');
});

test('buildRssItems appends a trailing slash when trailingSlash is true', () => {
  const [item] = buildRssItems([post('a', 'homelab')], { trailingSlash: true });
  assert.equal(item.link, '/blog/a/');
});

test('buildRssItems combines a trimmed custom base with a trailing slash', () => {
  const [item] = buildRssItems([post('a', 'homelab')], { base: '/posts/', trailingSlash: true });
  assert.equal(item.link, '/posts/a/');
});
