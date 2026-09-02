import { z } from 'astro/zod';
import type { BlogPostLike } from './types.ts';

/**
 * Zod schema for a blog collection. Pass `defaultAuthor` to set the per-site
 * fallback author. Use in the consuming app's content config:
 *
 *   import { defineCollection } from 'astro:content';
 *   import { glob } from 'astro/loaders';
 *   import { blogSchema } from '@vdaluz/astro-blog';
 *
 *   const blog = defineCollection({
 *     loader: glob({ pattern: '**\/*.md', base: './src/content/blog' }),
 *     schema: blogSchema({ defaultAuthor: 'Imperfect Systems' }),
 *   });
 *   export const collections = { blog };
 */
export function blogSchema(opts: { defaultAuthor?: string } = {}) {
  return z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.string(),
    author: z.string().default(opts.defaultAuthor ?? ''),
    tags: z.array(z.string()).optional(),
    heroImage: z.string().optional(),
    heroImageCredit: z
      .object({
        name: z.string(),
        url: z.string().url(),
        source: z.enum(['pexels', 'unsplash', 'openverse']),
        licenseName: z.string().optional(),
        licenseUrl: z.string().url().optional(),
      })
      .optional(),
    /** Affiliate program keys used by this post, e.g. ["amazon"]. See @vdaluz/astro-affiliate. */
    affiliates: z.array(z.string()).optional(),
  });
}

export interface BlogPostingSchemaOptions {
  post: BlogPostLike;
  /** Origin only, e.g. "https://imperfectsystems.com" (trailing slash tolerated). */
  siteUrl: string;
  /** Route prefix posts live under. Defaults to "/blog". */
  basePath?: string;
  /** Site/brand name for the JSON-LD publisher. Falls back to the post author. */
  publisherName?: string;
  /** BCP 47 language tag for the `inLanguage` field, e.g. "en" or "es". Omitted if unset. */
  locale?: string;
  /**
   * Whether this site's actual served/canonical post URL ends in a trailing slash.
   * Defaults to false. Check your own `<link rel="canonical">` output (and served-URL
   * behavior - prerendered routes on some hosts are slash-terminated regardless of the
   * app's own trailingSlash config) before setting this; don't assume it from the app
   * config alone. Mismatching this from the real canonical produces a self-inconsistent
   * page (JSON-LD `url` disagreeing with the declared canonical), which can cause search
   * engines to pick the wrong canonical form.
   */
  trailingSlash?: boolean;
}

/**
 * Builds a schema.org BlogPosting object for a post. Render it as JSON-LD via the
 * `BlogPostMeta.astro` component, or pass it to a Layout that injects `schema`.
 */
export function buildBlogPostingSchema({
  post,
  siteUrl,
  basePath = '/blog',
  publisherName,
  locale,
  trailingSlash = false,
}: BlogPostingSchemaOptions) {
  const origin = siteUrl.replace(/\/$/, '');
  const prefix = basePath.replace(/\/$/, '');
  const postUrl = `${origin}${prefix}/${post.id}${trailingSlash ? '/' : ''}`;
  const authorName = post.data.author || publisherName || '';
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.data.title,
    description: post.data.description,
    datePublished: post.data.pubDate.toISOString(),
    dateModified: (post.data.updatedDate ?? post.data.pubDate).toISOString(),
    author: { '@type': 'Person', name: authorName, url: origin },
    publisher: { '@type': 'Person', name: publisherName || authorName, url: origin },
    url: postUrl,
    mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
    // Points at the original file, not the .webp thumbnail PostCard/RelatedPosts render -
    // the original is the only file this package's own contract guarantees exists.
    ...(post.data.heroImage ? { image: new URL(post.data.heroImage, `${origin}/`).href } : {}),
    ...(locale ? { inLanguage: locale } : {}),
  };
}

const SCRIPT_TAG_ESCAPES: Record<string, string> = { '<': '\\u003c', '>': '\\u003e', '&': '\\u0026' };

/**
 * Serializes a value for embedding in an inline `<script>` tag (e.g. via
 * Astro's `set:html`). `JSON.stringify` does not escape `<`, so a `</script>`
 * or `<!--` inside any string value would close the script element early and
 * inject the remainder as markup - `<` is the load-bearing escape here; `>`
 * and `&` are escaped only for symmetry.
 */
export function serializeForScriptTag(value: unknown): string {
  return JSON.stringify(value).replace(/[<>&]/g, (char) => SCRIPT_TAG_ESCAPES[char]);
}
