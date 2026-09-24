/**
 * Strips one or more trailing slashes from a route prefix. A base of `/`
 * normalizes to `''` - callers must handle that as "no prefix", not append
 * it directly, or they'll produce a protocol-relative `//path` URL.
 */
export function normalizeBase(base: string): string {
  return base.replace(/\/+$/, '');
}

/**
 * Builds a post's root-relative href. The single source of post URLs for the
 * cards, `buildRssItems`, and `buildBlogPostingSchema`'s JSON-LD `url`/`@id`,
 * so a site whose canonical post URL is slash-terminated gets the same form
 * everywhere.
 */
export function postHref(base: string, id: string, trailingSlash = false): string {
  return `${normalizeBase(base)}/${id}${trailingSlash ? '/' : ''}`;
}
