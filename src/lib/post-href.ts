/**
 * Strips one or more trailing slashes from a route prefix. A base of `/`
 * normalizes to `''` - callers must handle that as "no prefix", not append
 * it directly, or they'll produce a protocol-relative `//path` URL.
 */
export function normalizeBase(base: string): string {
  return base.replace(/\/+$/, '');
}

/**
 * Builds a post's href. Matches the trailing-slash convention
 * `buildBlogPostingSchema` already applies to JSON-LD's `url`/`@id`, so a
 * site whose canonical post URL is slash-terminated doesn't get card/RSS
 * links that disagree with JSON-LD.
 */
export function postHref(base: string, id: string, trailingSlash = false): string {
  return `${normalizeBase(base)}/${id}${trailingSlash ? '/' : ''}`;
}
