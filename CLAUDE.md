# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

`@vdaluz/astro-blog`: shared Astro blog building blocks for vdaluz.com-family sites. Token-driven components (PostCard, RelatedPosts, Pagination, Subheading, BlogPostMeta), related-posts scoring, a schema factory (`blogSchema()`), RSS item builder, and Shiki config. It is a component library, not a drop-in blog: routes and content stay in each consuming app. Consumed by vdaluz.com and imperfectsystems.com as a pinned https-tarball dependency.

## Workflow

**No worktrees.** Work directly on `main` - this repo is small, single-maintainer, and worked sequentially. Consumers only ever see tagged releases, so `main` is safe to iterate on.

## Conventions

- **Raw source, no build step.** Ships `.ts` and `.astro` from `src/`; the consuming app's Astro/Vite compiles them. Never add a build/dist step or `main` field.
- **Per-path exports.** Components are exposed via the `exports` map in `package.json`. New public files need an exports entry.
- **Token-driven styling.** Components reference only the token custom properties documented in the README (`--bg`, `--surface`, `--surface-muted`, `--fg`, `--muted`, `--border`, `--accent`, `--accent-strong`, `--accent-soft`, `--on-accent`). Never hardcode a site's palette; `src/styles/tokens.example.css` is the reference set consumers copy.
- **Dependency-free.** The package has no runtime dependencies (pure data mapping; no @astrojs/rss import in the RSS helper, by design). Keep it that way unless the maintainer explicitly decides otherwise.
- **Consumers own Tailwind.** Utility classes used in components are only generated because consumers include `./node_modules/@vdaluz/astro-blog/**` in their Tailwind `content` glob. Changing class usage here can silently affect both sites; check both after component changes.

## Release process

Same tag-pinned-tarball process shared by all `@vdaluz/*` component libraries — see root
`~/Repos/CLAUDE.md` → "Astro shared-library release process".

## Consumers

- vdaluz.com
- imperfectsystems.com (dev-log blog; see that repo's CLAUDE.md Blog section)
