import { z } from 'astro/zod';
import type { BlogPostLike } from './types';

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
    category: z.string(),
    author: z.string().default(opts.defaultAuthor ?? ''),
    tags: z.array(z.string()).optional(),
    heroImage: z.string().optional(),
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
}: BlogPostingSchemaOptions) {
  const origin = siteUrl.replace(/\/$/, '');
  const prefix = basePath.replace(/\/$/, '');
  const postUrl = `${origin}${prefix}/${post.id}`;
  const authorName = post.data.author || publisherName || '';
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.data.title,
    description: post.data.description,
    datePublished: post.data.pubDate.toISOString(),
    dateModified: post.data.pubDate.toISOString(),
    author: { '@type': 'Person', name: authorName, url: origin },
    publisher: { '@type': 'Person', name: publisherName || authorName, url: origin },
    url: postUrl,
    mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
    ...(post.data.heroImage ? { image: `${origin}${post.data.heroImage}` } : {}),
  };
}
