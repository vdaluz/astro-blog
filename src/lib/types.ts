import type { z } from 'astro/zod';
import type { blogSchema } from './schema.ts';

type ParsedBlogPostData = z.output<ReturnType<typeof blogSchema>>;

export type HeroImageCredit = NonNullable<ParsedBlogPostData['heroImageCredit']>;

/**
 * Frontmatter as `blogSchema()` parses it, except `author` stays optional: the
 * schema always fills it with a default, but hand-built post data may omit it.
 */
export type BlogPostData = Omit<ParsedBlogPostData, 'author'> & { author?: string };

/**
 * Structural shape the blog components and helpers operate on.
 *
 * Deliberately NOT `CollectionEntry<'blog'>` from `astro:content`: that ties the
 * package to a collection literally named "blog" in the consuming app. A site's
 * `getCollection(...)` result is structurally assignable to `BlogPostLike` as long
 * as its frontmatter matches `blogSchema()`, so consumers pass their entries directly.
 */
export interface BlogPostLike {
  /** Astro content-collection entry id, used to build the post URL. */
  id: string;
  data: BlogPostData;
}
