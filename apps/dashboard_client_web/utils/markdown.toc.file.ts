import { readFile } from 'fs/promises';

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import { tocPlugin } from '@/utils/markdown.toc';

/**
 * @description Loads the content of a markdown file.
 * @param filePath The path to the Markdown file.
 * @returns A Promise that resolves to the file content as a string.
 */
export const loadMarkdownFile = async (filePath: string): Promise<string> => {
    const content = await readFile(filePath, 'utf8');
    return content;
};

/**
 * @description Parses markdown content into HTML and a table of contents.
 * @param content The markdown content string.
 * @returns A Promise that resolves to an object containing the HTML and TOC.
 */
export const parseMarkdownContent = async (
    content: string
): Promise<TProcessedMarkdown> => {
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
// const content = await loadMarkdownFile('article.md');
// const { html, toc } = await parseMarkdownContent(content);
