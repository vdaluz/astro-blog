# Changelog

All notable changes to this project are documented here. Format loosely follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

## [0.9.0] - 2026-07-25

### Added

- `HeroImageCredit` component rendering a post's `heroImageCredit` (photographer link, source, license link) - previously validated by `blogSchema()` but never rendered by anything, a real gap for CC/attribution-required sources like Openverse.
- Optional `updatedDate` field on `blogSchema()`, used for JSON-LD `dateModified` when present (falls back to `pubDate`).
- `HeroImageCredit`/`affiliates`/`updatedDate` added to the `BlogPostData` type, matching what `blogSchema()` already produced.

### Fixed

- `Pagination`'s disabled first/prev/next/last placeholders no longer use a non-focusable `role="button"` (an a11y smell - screen readers announced an inoperable button, keyboard users could never reach it) - now marked `aria-hidden` as pure decoration.
- `PostCard` and `RelatedPosts` images now set `loading="lazy"`, `decoding="async"`, and explicit `width`/`height` - below-the-fold listing images no longer eagerly fetch, and intrinsic dimensions reduce layout shift.

## [0.8.0] - 2026-07-25

### Added

- Optional `locale` prop on `TagFilterNav`, defaulting its `aria-label` to a locale-aware string when no explicit `ariaLabel` override is passed.

### Fixed

- `Pagination`'s outer nav `aria-label` and `TagFilterNav`'s default `aria-label` no longer hardcode English - both now route through `t(locale)`.

## [0.7.2] - 2026-07-25

### Added

- `repository`, `homepage`, `bugs`, and `keywords` fields to `package.json` for GitHub/npm discoverability, plus `sideEffects: false` (the package is a pure re-export entry point).
- This CHANGELOG, backfilled from tag history.

## [0.7.1] - 2026-07-25

### Changed

- Reframed the README around the general problem solved instead of internal framing, fixed a stale install-tag pin, added a Contributing section and a real PostCard example screenshot.

### Added

- CI (typecheck + tests) via GitHub Actions.

## [0.7.0] - 2026-07-24

### Added

- `TableOfContents` component and a reading-time remark plugin.

## [0.6.4] - 2026-07-18

### Fixed

- `TagFilterNav` pills now have a resting-state accent border.

## [0.6.3] - 2026-07-18

### Fixed

- WCAG 44px touch targets for `Pagination`.

## [0.6.2] - 2026-07-17

### Fixed

- Replaced Tailwind v3-only utility class names in `RelatedPosts`.

### Changed

- Added a Consumers section to the README.

## [0.6.1] - 2026-07-16

### Added

- Optional `categoryLabel` override for `PostCard` and `RelatedPosts`.

## [0.6.0] - 2026-07-12

### Added

- `filterPostsByTag()` and the `TagFilterNav` component.

## [0.5.0] - 2026-07-12

### Added

- Locale-aware text for `PostCard`, `RelatedPosts`, `Pagination`, and `BlogPostMeta`.

## [0.4.0] - 2026-07-11

### Added

- Optional `heroImageCredit` field on `blogSchema`.

## [0.3.0] - 2026-07-10

### Added

- Optional `affiliates` field on `blogSchema`.

### Changed

- Added the MIT `LICENSE` file and a `CLAUDE.md` documenting package conventions and the release process.

## [0.2.0] - 2026-07-03

### Added

- `buildRssItems` helper for RSS feed generation.

### Fixed

- `PostCard` and `RelatedPosts` now serve `.webp` thumbnails instead of the raw `heroImage`.

### Changed

- Install docs now recommend the https tarball (CI-safe) over `github:` (which resolves to `git+ssh`).

## [0.1.0] - 2026-06-20

### Added

- Initial release: token-driven blog components, related-posts scoring, a schema factory, and Shiki config.
