/**
 * Builds a post's href. Matches the trailing-slash convention
 * `buildBlogPostingSchema` already applies to JSON-LD's `url`/`@id`, so a
 * site whose canonical post URL is slash-terminated doesn't get card/RSS
 * links that disagree with JSON-LD.
 */
export function postHref(base: string, id: string, trailingSlash = false): string {
  return `${base}/${id}${trailingSlash ? '/' : ''}`;
}
