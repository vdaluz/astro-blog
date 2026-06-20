/**
 * Shared Shiki config for `markdown.shikiConfig` in astro.config.mjs.
 *
 * `defaultColor: false` makes Shiki emit `--shiki-light` / `--shiki-dark` CSS vars
 * instead of baked-in colors. The matching CSS handoff (see styles/tokens.example.css)
 * picks the right one based on the `.dark` class on <html>. The two MUST ship together
 * or code blocks render with no color.
 *
 * Dark-only sites: keep this config and force `<html class="dark">` so the dark vars
 * always apply (no toggle needed).
 */
export const shikiConfig = {
  themes: {
    light: 'github-light-high-contrast',
    dark: 'github-dark-high-contrast',
  },
  defaultColor: false as const,
};
