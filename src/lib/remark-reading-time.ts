const WORDS_PER_MINUTE = 200;

/** Minimal shape this plugin cares about - avoids a mdast-util-* type dependency. */
interface MdastNode {
  type: string;
  value?: string;
  children?: MdastNode[];
}

interface VFileWithAstroFrontmatter {
  data?: {
    astro?: {
      frontmatter?: {
        minutesRead?: number;
      };
    };
  };
}

function collectText(node: MdastNode, out: string[]) {
  if (typeof node.value === 'string') out.push(node.value);
  if (node.children) {
    for (const child of node.children) collectText(child, out);
  }
}

/**
 * Remark plugin: counts words in the post body and writes the rounded-up
 * reading time (at 200 wpm) to `minutesRead` in the page's frontmatter.
 *
 *   import { remarkReadingTime } from '@vdaluz/astro-blog/remark';
 *
 *   export default defineConfig({
 *     markdown: { remarkPlugins: [remarkReadingTime] },
 *   });
 */
export function remarkReadingTime() {
  return (tree: MdastNode, file: VFileWithAstroFrontmatter) => {
    const textParts: string[] = [];
    collectText(tree, textParts);
    const wordCount = textParts.join(' ').split(/\s+/).filter(Boolean).length;
    const minutesRead = Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));

    file.data ??= {};
    file.data.astro ??= {};
    file.data.astro.frontmatter ??= {};
    file.data.astro.frontmatter.minutesRead = minutesRead;
  };
}
