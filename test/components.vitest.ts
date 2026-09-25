import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import PostCard from '../src/components/PostCard.astro';
import RelatedPosts from '../src/components/RelatedPosts.astro';
import Pagination from '../src/components/Pagination.astro';
import TagFilterNav from '../src/components/TagFilterNav.astro';
import type { BlogPostLike } from '../src/lib/types.ts';

const post: BlogPostLike = {
  id: 'my-post',
  data: {
    title: 'My Post',
    description: 'A post',
    pubDate: new Date(2026, 0, 1),
    category: 'homelab',
    heroImage: '/images/my-post.jpg',
  },
};

const anchorAttrs = (html: string) => [...html.matchAll(/<a\b([^>]*)>/g)].map((m) => m[1]);
const thumbnailLinkAttrs = (html: string) => html.match(/<a\b([^>]*)>\s*<img/)?.[1];

let container: AstroContainer;

beforeAll(async () => {
  container = await AstroContainer.create();
});

describe.each([
  ['PostCard', () => container.renderToString(PostCard, { props: { post } })],
  ['RelatedPosts', () => container.renderToString(RelatedPosts, { props: { posts: [post] } })],
])('%s', (_name, render) => {
  it('hides the thumbnail link from the accessibility tree and the tab order', async () => {
    const attrs = thumbnailLinkAttrs(await render());
    expect(attrs).toBeDefined();
    expect(attrs).toContain('aria-hidden="true"');
    expect(attrs).toContain('tabindex="-1"');
  });

  it('gives the thumbnail image an empty alt', async () => {
    expect(await render()).toMatch(/<img\b[^>]*\balt=""/);
  });

  it('names the Read link with a visually hidden title span, not an aria-label', async () => {
    const html = await render();
    expect(html).toContain('<span class="sr-only">: My Post</span>');
    expect(anchorAttrs(html).filter((attrs) => attrs.includes('aria-label'))).toEqual([]);
  });

  it('hides the decorative arrow icon', async () => {
    expect(await render()).toMatch(/<svg\b[^>]*aria-hidden="true"/);
  });
});

describe('Pagination', () => {
  const page = (currentPage: number, url: Record<string, string | undefined>) => ({
    currentPage,
    lastPage: 3,
    url,
  });

  it('labels the nav and the edge links in the requested locale', async () => {
    const html = await container.renderToString(Pagination, {
      props: {
        locale: 'es',
        page: page(2, { first: '/blog', prev: '/blog', next: '/blog/3', last: '/blog/3' }),
      },
    });
    expect(html).toContain('aria-label="Paginación del blog"');
    expect(html).toContain('aria-label="Ir a la primera página"');
    expect(html).toContain('aria-label="Ir a la página anterior"');
    expect(html).toContain('aria-label="Ir a la página siguiente"');
    expect(html).toContain('aria-label="Ir a la última página"');
  });

  it('marks the current page with aria-current', async () => {
    const html = await container.renderToString(Pagination, {
      props: { page: page(2, { prev: '/blog', next: '/blog/3' }) },
    });
    expect(html).toMatch(/<span\b[^>]*aria-current="page"[^>]*>\s*2\s*<\/span>/);
  });

  it('renders unavailable edge controls as aria-hidden spans, never a role="button"', async () => {
    const html = await container.renderToString(Pagination, {
      props: { page: page(1, { next: '/blog/2', last: '/blog/3' }) },
    });
    expect(html).not.toContain('role="button"');
    expect(html.match(/<span\b[^>]*aria-hidden="true"[^>]*>\s*(&laquo;|«|&lsaquo;|‹)\s*<\/span>/g)).toHaveLength(2);
  });
});

describe('TagFilterNav', () => {
  const options = [
    { label: 'All', href: '/blog' },
    { label: 'homelab', href: '/blog/tag/homelab', active: true },
  ];

  it('defaults the nav label to the requested locale', async () => {
    const html = await container.renderToString(TagFilterNav, { props: { options, locale: 'es' } });
    expect(html).toContain('aria-label="Filtrar publicaciones"');
  });

  it('marks only the active option with aria-current', async () => {
    const html = await container.renderToString(TagFilterNav, { props: { options } });
    const current = anchorAttrs(html).filter((attrs) => attrs.includes('aria-current="page"'));
    expect(current).toHaveLength(1);
    expect(current[0]).toContain('href="/blog/tag/homelab"');
  });
});
