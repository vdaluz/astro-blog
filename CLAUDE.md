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

Tag-pinned tarballs, no registry:

1. Test before tagging: `npm pack`, install the tarball into a scratch Astro app (or one of the consumers locally), `astro check && astro build`.
2. Bump `version` in `package.json`, commit.
3. Tag `vX.Y.Z` and push the tag. **The tag must be public before any consumer CI references it** - the tarball URL 404s otherwise.
4. Bump the tag in each consumer's `package.json` dependency URL (`https://github.com/vdaluz/astro-blog/archive/refs/tags/vX.Y.Z.tar.gz` - tarball, not `github:`, because npm rewrites shorthand to `git+ssh`, which fails in CI without SSH keys).

## Consumers

- vdaluz.com
- imperfectsystems.com (dev-log blog; see that repo's CLAUDE.md Blog section)
