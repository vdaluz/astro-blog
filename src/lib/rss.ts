import type { BlogPostLike } from './types.ts';
import { postHref } from './post-href.ts';

/**
 * Structurally assignable to @astrojs/rss's `RSSFeedItem` - this package doesn't
 * depend on @astrojs/rss itself, so consumers pass `buildRssItems(posts)` straight
 * into `rss({ items })` from their own app-local route.
 */
export interface RssItem {
  title: string;
  description: string;
  pubDate: Date;
  link: string;
  categories?: string[];
}

/**
 * Maps posts to RSS feed items. `link` is root-relative (`${base}/${post.id}`);
 * @astrojs/rss resolves relative links against `site` itself.
 *
 * `author` is intentionally not mapped: the RSS spec's `author` field expects an
 * email address, but `BlogPostData.author` is a display name.
 */
export function buildRssItems(
  posts: BlogPostLike[],
  opts?: {
    /** Route prefix posts live under. Defaults to "/blog". */
    base?: string;
    /** @deprecated Use `base`. Removed in 2.0. Ignored when `base` is set. */
    basePath?: string;
    trailingSlash?: boolean;
  },
): RssItem[] {
  const base = opts?.base ?? opts?.basePath ?? '/blog';
  return posts.map((post) => ({
    title: post.data.title,
    description: post.data.description,
    pubDate: post.data.pubDate,
    link: postHref(base, post.id, opts?.trailingSlash),
    categories: [post.data.category, ...(post.data.tags ?? [])].filter(
      (c, i, a) => a.indexOf(c) === i,
    ),
  }));
}
