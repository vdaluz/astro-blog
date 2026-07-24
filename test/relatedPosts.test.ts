import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeTag, scoreRelated } from '../src/lib/relatedPosts.ts';
import type { BlogPostLike } from '../src/lib/types.ts';

function post(id: string, tags: string[], category: string, pubDate: Date): BlogPostLike {
  return { id, data: { title: id, description: '', pubDate, category, tags } };
}

test('normalizeTag lowercases and trims', () => {
  assert.equal(normalizeTag('  Pi-Hole  '), 'pi-hole');
});

test('normalizeTag maps a known alias after lowercasing', () => {
  assert.equal(normalizeTag('PiHole', { pihole: 'pi-hole' }), 'pi-hole');
});

test('normalizeTag falls through unchanged when no alias matches', () => {
  assert.equal(normalizeTag('docker', { pihole: 'pi-hole' }), 'docker');
});

test('scoreRelated excludes the target post itself', () => {
  const target = post('a', ['docker'], 'homelab', new Date(2026, 0, 1));
  const result = scoreRelated(target, [target]);
  assert.deepEqual(result, []);
});

test('scoreRelated drops candidates with zero tag overlap', () => {
  const target = post('a', ['docker'], 'homelab', new Date(2026, 0, 1));
  const unrelated = post('b', ['gardening'], 'homelab', new Date(2026, 0, 1));
  assert.deepEqual(scoreRelated(target, [unrelated]), []);
});

test('scoreRelated ranks higher tag overlap above lower overlap', () => {
  const target = post('a', ['docker', 'zfs', 'proxmox'], 'homelab', new Date(2026, 0, 1));
  const high = post('high', ['docker', 'zfs'], 'other', new Date(2026, 0, 1));
  const low = post('low', ['docker'], 'other', new Date(2026, 0, 1));
  const result = scoreRelated(target, [low, high]);
  assert.deepEqual(result.map((p) => p.id), ['high', 'low']);
});

test('scoreRelated applies a same-category bonus only when base score is already positive', () => {
  const target = post('a', ['docker'], 'homelab', new Date(2026, 0, 1));
  const sameCategoryNoOverlap = post('same-cat', ['gardening'], 'homelab', new Date(2026, 0, 1));
  // no tag overlap -> score stays 0 even though category matches, so it's excluded
  assert.deepEqual(scoreRelated(target, [sameCategoryNoOverlap]), []);

  const sameCategoryOverlap = post('same-cat-overlap', ['docker'], 'homelab', new Date(2026, 0, 1));
  const diffCategoryOverlap = post('diff-cat-overlap', ['docker'], 'other', new Date(2026, 0, 1));
  const result = scoreRelated(target, [diffCategoryOverlap, sameCategoryOverlap]);
  assert.deepEqual(result.map((p) => p.id), ['same-cat-overlap', 'diff-cat-overlap']);
});

test('scoreRelated breaks equal scores by recency, newest first', () => {
  const target = post('a', ['docker'], 'homelab', new Date(2026, 0, 1));
  const older = post('older', ['docker'], 'other', new Date(2025, 0, 1));
  const newer = post('newer', ['docker'], 'other', new Date(2026, 5, 1));
  const result = scoreRelated(target, [older, newer]);
  assert.deepEqual(result.map((p) => p.id), ['newer', 'older']);
});

test('scoreRelated respects the k limit', () => {
  const target = post('a', ['docker'], 'homelab', new Date(2026, 0, 1));
  const candidates = ['b', 'c', 'd', 'e'].map((id) =>
    post(id, ['docker'], 'other', new Date(2026, 0, 1)),
  );
  assert.equal(scoreRelated(target, candidates, { k: 2 }).length, 2);
  assert.equal(scoreRelated(target, candidates).length, 3);
});

test('scoreRelated treats a post with no tags as having zero overlap with anything', () => {
  const target = post('a', [], 'homelab', new Date(2026, 0, 1));
  const other = post('b', ['docker'], 'homelab', new Date(2026, 0, 1));
  assert.deepEqual(scoreRelated(target, [other]), []);
});
