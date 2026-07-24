import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildBlogPostingSchema } from '../src/lib/schema.ts';
import type { BlogPostLike } from '../src/lib/types.ts';

function post(overrides: Partial<BlogPostLike['data']> = {}): BlogPostLike {
  return {
    id: 'my-post',
    data: {
      title: 'My Post',
      description: 'A post',
      pubDate: new Date(2026, 0, 1),
      category: 'homelab',
      author: 'Vic',
      ...overrides,
    },
  };
}

test('buildBlogPostingSchema trims trailing slashes from siteUrl and basePath', () => {
  const schema = buildBlogPostingSchema({ post: post(), siteUrl: 'https://example.com/', basePath: '/blog/' });
  assert.equal(schema.url, 'https://example.com/blog/my-post');
});

test('buildBlogPostingSchema defaults basePath to /blog', () => {
  const schema = buildBlogPostingSchema({ post: post(), siteUrl: 'https://example.com' });
  assert.equal(schema.url, 'https://example.com/blog/my-post');
});

test('buildBlogPostingSchema falls back author -> publisherName -> empty string', () => {
  const withAuthor = buildBlogPostingSchema({ post: post({ author: 'Vic' }), siteUrl: 'https://example.com' });
  assert.equal(withAuthor.author.name, 'Vic');

  const noAuthor = buildBlogPostingSchema({
    post: post({ author: '' }),
    siteUrl: 'https://example.com',
    publisherName: 'Example Site',
  });
  assert.equal(noAuthor.author.name, 'Example Site');

  const neither = buildBlogPostingSchema({ post: post({ author: '' }), siteUrl: 'https://example.com' });
  assert.equal(neither.author.name, '');
});

test('buildBlogPostingSchema publisher falls back to the resolved author name when publisherName is unset', () => {
  const schema = buildBlogPostingSchema({ post: post({ author: 'Vic' }), siteUrl: 'https://example.com' });
  assert.equal(schema.publisher.name, 'Vic');
});

test('buildBlogPostingSchema publisher prefers publisherName over author when both are set', () => {
  const schema = buildBlogPostingSchema({
    post: post({ author: 'Vic' }),
    siteUrl: 'https://example.com',
    publisherName: 'Example Site',
  });
  assert.equal(schema.publisher.name, 'Example Site');
});

test('buildBlogPostingSchema omits image when heroImage is unset', () => {
  const schema = buildBlogPostingSchema({ post: post(), siteUrl: 'https://example.com' });
  assert.equal('image' in schema, false);
});

test('buildBlogPostingSchema resolves image against siteUrl when heroImage is set', () => {
  const schema = buildBlogPostingSchema({
    post: post({ heroImage: '/images/hero.png' }),
    siteUrl: 'https://example.com',
  });
  assert.equal(schema.image, 'https://example.com/images/hero.png');
});

test('buildBlogPostingSchema omits inLanguage when locale is unset', () => {
  const schema = buildBlogPostingSchema({ post: post(), siteUrl: 'https://example.com' });
  assert.equal('inLanguage' in schema, false);
});

test('buildBlogPostingSchema sets inLanguage when locale is given', () => {
  const schema = buildBlogPostingSchema({ post: post(), siteUrl: 'https://example.com', locale: 'es' });
  assert.equal(schema.inLanguage, 'es');
});

test('buildBlogPostingSchema sets dateModified equal to pubDate, current behavior (AST-6 will change this)', () => {
  const p = post({ pubDate: new Date(2026, 0, 1) });
  const schema = buildBlogPostingSchema({ post: p, siteUrl: 'https://example.com' });
  assert.equal(schema.dateModified, schema.datePublished);
  assert.equal(schema.datePublished, p.data.pubDate.toISOString());
});
