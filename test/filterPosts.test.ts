import { test } from 'node:test';
import assert from 'node:assert/strict';
import { filterPostsByTag } from '../src/lib/filterPosts.ts';
import type { BlogPostLike } from '../src/lib/types.ts';

function post(id: string, tags?: string[]): BlogPostLike {
  return { id, data: { title: id, description: '', pubDate: new Date(2026, 0, 1), category: 'homelab', tags } };
}

test('filterPostsByTag matches case-insensitively', () => {
  const posts = [post('a', ['Docker']), post('b', ['ZFS'])];
  assert.deepEqual(
    filterPostsByTag(posts, 'docker').map((p) => p.id),
    ['a'],
  );
});

test('filterPostsByTag resolves aliases on both the query and the post tags', () => {
  const posts = [post('a', ['pi-hole']), post('b', ['zfs'])];
  assert.deepEqual(
    filterPostsByTag(posts, 'PiHole', { pihole: 'pi-hole' }).map((p) => p.id),
    ['a'],
  );
});

test('filterPostsByTag treats a post with no tags field as having no matches', () => {
  const posts = [post('a', undefined), post('b', ['docker'])];
  assert.deepEqual(
    filterPostsByTag(posts, 'docker').map((p) => p.id),
    ['b'],
  );
});

test('filterPostsByTag returns an empty array when nothing matches', () => {
  const posts = [post('a', ['docker'])];
  assert.deepEqual(filterPostsByTag(posts, 'gardening'), []);
});
