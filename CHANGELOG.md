# Changelog

All notable changes to this project are documented here. Format loosely follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Fixed

- `BlogPostMeta`'s JSON-LD script tag used raw `JSON.stringify`, which does not escape `<` - a post `title`/`description` containing `</script>` or `<!--` would close the script element early and inject the remainder as markup. Added an internal `serializeForScriptTag` helper (matching the escaping `@vdaluz/astro-opt-in-analytics`'s `ConsentGate.astro` already does) and switched `BlogPostMeta.astro` to use it.

## [1.0.1] - 2026-08-29

### Fixed

- `PostCard`'s "Read More" link now carries an `aria-label` including the post title (matching the existing pattern in `RelatedPosts`), instead of the generic label alone repeated identically across every card on a page. Also marks its decorative arrow SVG `aria-hidden="true"` for consistency with `RelatedPosts`.

## [1.0.0] - 2026-08-22

### Changed

- **Stability declaration only, no breaking changes.** 18 releases in with no breaking changes recorded and stable in production across multiple sites - this bump declares the public API stable, not a rewrite. Future breaking changes will bump the major version as semver expects from here on.

## [0.12.0] - 2026-08-22

### Added

- `buildBlogPostingSchema`/`BlogPostMeta` accept an optional `trailingSlash` prop to control whether the JSON-LD `url`/`mainEntityOfPage.@id` fields are slash-terminated.

### Changed

- `Locale` widened from a closed `'en' | 'es' | 'pt'` union to accept any string (known locales still autocomplete). `t()` now falls back to `en` strings for an unrecognized locale instead of returning `undefined`, and accepts an optional `overrides?: Partial<Strings>` so a consumer can supply its own strings for a locale the package doesn't ship, without a version bump. `formatDate()` falls back to passing the raw locale string to `Intl.DateTimeFormat` for unrecognized locales. `Strings` and `BUILT_IN_LOCALES` are now exported.

### Removed

- Dropped the tarball-install alternative from the README - every consumer moved to npm-registry semver pins, and the tarball block's hardcoded version tag had drifted from the published version.

### Documentation

- Added npm version and license badges. Standardized the README's tail-section order and added a License section.

## [0.10.0] - 2026-08-03

### Added

- `pt` added to `Locale` (Brazilian Portuguese), with matching `STRINGS` and `DATE_LOCALE` entries. Unblocks pt-BR routing in a downstream consumer site.

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
