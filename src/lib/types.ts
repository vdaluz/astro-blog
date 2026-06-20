/**
 * Structural shape the blog components and helpers operate on.
 *
 * Deliberately NOT `CollectionEntry<'blog'>` from `astro:content`: that ties the
 * package to a collection literally named "blog" in the consuming app. A site's
 * `getCollection(...)` result is structurally assignable to `BlogPostLike` as long
 * as its frontmatter matches `blogSchema()`, so consumers pass their entries directly.
 */
export interface BlogPostData {
  title: string;
  description: string;
  pubDate: Date;
  category: string;
  author?: string;
  tags?: string[];
  heroImage?: string;
}

export interface BlogPostLike {
  /** Astro content-collection entry id, used to build the post URL. */
  id: string;
  data: BlogPostData;
}
