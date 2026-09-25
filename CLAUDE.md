# CLAUDE.md

## What this repo is

`@vdaluz/astro-blog`: shared Astro blog building blocks for vdaluz.com-family sites. Token-driven components (PostCard, RelatedPosts, Pagination, Subheading, BlogPostMeta), related-posts scoring, a schema factory (`blogSchema()`), RSS item builder, and Shiki config. It is a component library, not a drop-in blog: routes and content stay in each consuming app. Consumed as an npm-registry semver pin by the sites in the README's Consumers section.

## Workflow

Shared preamble: `.claude/rules/git-workflow-direct-to-main.md`.

## Plane (AST project)

Project ID, state UUIDs, and label UUIDs: **`.claude/plane.yml`**.

## Conventions

Shared `@vdaluz/astro-*` conventions (raw source/no build step, per-path exports, `.ts` extensions on relative imports):
`.claude/rules/astro-package-conventions.md`.

- **Token-driven styling.** Components reference only the token custom properties documented in the README (`--bg`, `--surface`, `--surface-muted`, `--fg`, `--muted`, `--border`, `--accent`, `--accent-strong`, `--accent-soft`, `--on-accent`). Never hardcode a site's palette; `src/styles/tokens.example.css` is the reference set consumers copy.
- **Dependency-free.** The package has no runtime dependencies (pure data mapping; no @astrojs/rss import in the RSS helper, by design). Keep it that way unless the maintainer explicitly decides otherwise.
- **Consumers own Tailwind.** Utility classes used in components are only generated because consumers include `./node_modules/@vdaluz/astro-blog/**` in their Tailwind `content` glob. Changing class usage here can silently affect every consumer site; check them after component changes.

## Release process

Same tag-then-npm-publish process shared by all `@vdaluz/*` component libraries, consumed via
npm-registry semver pins (not tarball URLs). See the README's "Releasing" section for the
concrete steps.

## Consumers

The README's Consumers section is the single list. Update it when a repo adds or drops its `@vdaluz/astro-blog` dependency (`grep -l '"@vdaluz/astro-blog"' ~/Repos/*/package.json`).
