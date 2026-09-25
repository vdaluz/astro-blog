/** Consumers must generate a matching .webp for every heroImage (see README). */
export function heroImageWebp(heroImage?: string): string | undefined {
  return heroImage?.replace(/\.(jpe?g|png|gif)$/i, '.webp');
}
