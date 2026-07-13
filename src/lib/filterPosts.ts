import type { BlogPostLike } from './types';
import { normalizeTag } from './relatedPosts';

/**
 * Returns posts from `posts` carrying `tag` (case-insensitive, alias-aware via the
 * same `aliases` map `scoreRelated`/`normalizeTag` use). Does not sort - callers
 * already sort before paginating (see per-app glue in the README).
 */
export function filterPostsByTag<T extends BlogPostLike>(
  posts: T[],
  tag: string,
  aliases: Record<string, string> = {}
): T[] {
  const target = normalizeTag(tag, aliases);
  return posts.filter((post) =>
    (post.data.tags ?? []).some((t) => normalizeTag(t, aliases) === target)
  );
}
