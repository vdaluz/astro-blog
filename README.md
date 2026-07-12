# @vdaluz/astro-blog

Shared Astro blog building blocks for vdaluz.com-family sites: token-driven components, related-posts scoring, a schema factory, and Shiki config. Ships raw `.astro` and `.ts` — the consuming app's Astro/Vite compiles them (no prebuild step).

> **Scope:** this is a component library, not a drop-in blog. Routes (`src/pages/blog/*`) and content (`src/content/blog/*.md`) stay in each app — see [Per-app glue](#per-app-glue).

## Install

Pinned https tarball from a tag (no registry needed):

```jsonc
// package.json
"dependencies": {
  "@vdaluz/astro-blog": "https://github.com/vdaluz/astro-blog/archive/refs/tags/v0.2.0.tar.gz"
}
```

> **Why a tarball, not `github:vdaluz/astro-blog#v0.1.0`?** npm canonicalizes GitHub
> shorthand (and even an explicit `git+https://` URL) to `git+ssh://` in the lockfile.
> CI runners (e.g. Cloudflare Pages/Workers) have no SSH key, so `npm ci` would fail to
> clone it. The `/archive/refs/tags/<tag>.tar.gz` URL is anonymous https with an integrity
> hash in the lockfile — it just works in CI. Bump the tag in the URL to upgrade.

Peer dependency: `astro` >= 6. For post body styling you'll also want `@tailwindcss/typography` in the app.

## Four things every consumer MUST do

1. **Define the token CSS variables.** Components reference only these names:
   `bg`, `surface`, `surface-muted`, `fg`, `muted`, `border`, `accent`, `accent-strong`, `accent-soft`, `on-accent`.
   Copy `src/styles/tokens.example.css` into your app and set your palette.

2. **Alias the tokens in `tailwind.config.mjs` AND scan the package** (this glob is the #1 thing people forget — without it the package's utility classes are never generated):

   ```js
   export default {
     content: [
       './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
       './node_modules/@vdaluz/astro-blog/**/*.{astro,ts}', // <-- required
     ],
     theme: {
       extend: {
         colors: {
           bg: 'rgb(var(--bg) / <alpha-value>)',
           surface: 'rgb(var(--surface) / <alpha-value>)',
           'surface-muted': 'rgb(var(--surface-muted) / <alpha-value>)',
           fg: 'rgb(var(--fg) / <alpha-value>)',
           muted: 'rgb(var(--muted) / <alpha-value>)',
           border: 'rgb(var(--border) / <alpha-value>)',
           accent: 'rgb(var(--accent) / <alpha-value>)',
           'accent-strong': 'rgb(var(--accent-strong) / <alpha-value>)',
           'accent-soft': 'rgb(var(--accent-soft) / <alpha-value>)',
           'on-accent': 'rgb(var(--on-accent) / <alpha-value>)',
         },
       },
     },
     plugins: [require('@tailwindcss/typography')],
   };
   ```

3. **Wire Shiki** in `astro.config.mjs` and ship the matching CSS handoff (included in `tokens.example.css`):

   ```js
   import { shikiConfig } from '@vdaluz/astro-blog';
   export default defineConfig({ markdown: { shikiConfig } });
   ```

   The `shikiConfig` uses `defaultColor: false`, so the CSS handoff is what actually colors code blocks. They must ship together. **Dark-only sites:** keep `shikiConfig` and force `<html class="dark">` so the dark vars always apply.

4. **Generate a matching `.webp` sibling for every `heroImage`.** `PostCard` and `RelatedPosts` derive the thumbnail `src` by swapping the `heroImage` extension (`.jpg`/`.jpeg`/`.png`/`.gif`) for `.webp` — they never render the raw file. If a post sets `heroImage: /assets/images/foo.jpeg`, `assets/images/foo.webp` must exist at that same path or the thumbnail 404s. Any image pipeline that outputs a same-basename `.webp` next to the original works (e.g. a Sharp-based build step); nothing in this package generates it for you.

## Exports

| Import | What |
| --- | --- |
| `@vdaluz/astro-blog` | `blogSchema`, `buildBlogPostingSchema`, `scoreRelated`, `normalizeTag`, `shikiConfig`, `buildRssItems`, `t`, `formatDate`, types |
| `@vdaluz/astro-blog/PostCard.astro` | Post card for listings |
| `@vdaluz/astro-blog/RelatedPosts.astro` | Related-posts grid |
| `@vdaluz/astro-blog/Pagination.astro` | Paginated listing nav |
| `@vdaluz/astro-blog/Subheading.astro` | Small uppercase section label |
| `@vdaluz/astro-blog/BlogPostMeta.astro` | JSON-LD BlogPosting `<script>` |

Components that build post URLs (`PostCard`, `RelatedPosts`, `Pagination`) accept an optional `base` prop (default `/blog`).

`PostCard`, `RelatedPosts`, `Pagination`, and `BlogPostMeta` accept an optional `locale` prop (`'en' | 'es'`, default `'en'`) that localizes their built-in UI strings (dates, "Read More", pagination labels) and `BlogPostMeta`'s JSON-LD `inLanguage` field. It does not affect the post URLs those components build - a locale-specific `base` still needs passing separately if the consuming app routes translated posts under a different prefix (e.g. `/es/blog`).

## Per-app glue

Each site keeps these — they can't be packaged because they bind to the app's own collection and routes.

`src/content.config.ts`:

```ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { blogSchema } from '@vdaluz/astro-blog';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: blogSchema({ defaultAuthor: 'Your Name' }),
});
export const collections = { blog };
```

`src/pages/blog/[...page].astro` and `[...slug].astro`: do `getCollection` / `getStaticPaths` / `render()` in-app (tied to your collection), then render the package components. Keep `export const prerender = true`. Site-specific headings and CTAs live here.

Related posts:

```ts
import { scoreRelated } from '@vdaluz/astro-blog';
const related = scoreRelated(entry, allPosts, { k: 3, aliases: { ha: 'home-assistant' } });
```

RSS feed (`src/pages/rss.xml.ts`, needs the app's own `@astrojs/rss` dependency — this package doesn't ship it):

```ts
import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { buildRssItems } from '@vdaluz/astro-blog';

export const prerender = true;

export const GET: APIRoute = async (context) => {
  const now = new Date();
  const posts = (await getCollection('blog'))
    .filter((p) => p.data.pubDate <= now)
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

  return rss({
    title: 'Your Site — Blog',
    description: 'Your site description',
    site: context.site!,
    items: buildRssItems(posts),
  });
};
```
