import { readFileSync } from 'fs';

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import { tocPlugin } from '@/utils/markdown.toc';

/**
 *
 * @description Processes a Markdown file to generate HTML and a table of contents.
 * @param filePath The path to the Markdown file to be processed.
 * @returns A Promise that resolves to an object containing the generated HTML and the table of contents.
 */
export const processMarkdownFile = async (
    filePath: string
): Promise<TProcessedMarkdown> => {
    const content = await readFileSync(filePath, 'utf8');

    const processor = unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(tocPlugin)
        .use(remarkRehype)
        .use(rehypeSlug)
        .use(rehypeStringify);

    const result = await processor.process(content);

    return {
        html: String(result),
        toc: result.data.toc as TTocItem[],
    };
};

// 사용
// const { html, toc } = await processMarkdownFile('article.md');
