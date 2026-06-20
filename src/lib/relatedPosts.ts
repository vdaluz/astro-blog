import type { BlogPostLike } from './types';

export interface ScoreRelatedOptions {
  /** Max number of related posts to return. Defaults to 3. */
  k?: number;
  /**
   * Collapse known tag spelling variants to a canonical form (after lowercasing).
   * Content-specific, so it's passed in rather than baked in. Example:
   *   { pihole: 'pi-hole', homeassistant: 'home-assistant', ha: 'home-assistant' }
   */
  aliases?: Record<string, string>;
}

export function normalizeTag(tag: string, aliases: Record<string, string> = {}): string {
  const lower = tag.toLowerCase().trim();
  return aliases[lower] ?? lower;
}

function jaccard(a: string[], b: string[], aliases: Record<string, string>): number {
  if (a.length === 0 || b.length === 0) return 0;
  const sa = new Set(a.map((t) => normalizeTag(t, aliases)));
  const sb = new Set(b.map((t) => normalizeTag(t, aliases)));
  let overlap = 0;
  for (const t of sa) if (sb.has(t)) overlap++;
  return overlap / (sa.size + sb.size - overlap);
}

/**
 * Returns up to `k` posts from `candidates` most related to `target`, ordered by
 * tag Jaccard similarity (+0.1 same-category bonus), then recency. Only posts with
 * score > 0 are returned.
 */
export function scoreRelated(
  target: BlogPostLike,
  candidates: BlogPostLike[],
  options: ScoreRelatedOptions = {}
): BlogPostLike[] {
  const { k = 3, aliases = {} } = options;
  const tTags = target.data.tags ?? [];

  return candidates
    .filter((c) => c.id !== target.id)
    .map((c) => {
      let score = jaccard(tTags, c.data.tags ?? [], aliases);
      if (score > 0 && c.data.category === target.data.category) score += 0.1;
      return { entry: c, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.entry.data.pubDate.getTime() - a.entry.data.pubDate.getTime();
    })
    .slice(0, k)
    .map((s) => s.entry);
}
