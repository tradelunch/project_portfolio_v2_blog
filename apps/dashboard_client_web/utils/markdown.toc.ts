import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';

import remarkToc from "remark-toc";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from 'rehype-stringify';

import { visit } from 'unist-util-visit';
import type { Root } from 'mdast';
import type { VFile } from 'vfile';

export const tocPlugin = () => {
    return (tree: Root, file: VFile) => {
        const toc: TTocItem[] = [];

        visit(tree, 'heading', (node) => {
            const text = node.children
                .map((child) => {
                    if (child.type === 'text') return child.value;
                    if (child.type === 'inlineCode') return child.value;
                    return '';
                })
                .join('');

            const slug = text
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-');

            toc.push({
                depth: node.depth,
                text,
                slug,
            });
        });

        file.data.toc = toc;
    };
};

export class MarkdownProcessor {
    // 1. The processor is now a private static property.
    // It's created only once and shared across all calls.
    private static processor = unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(tocPlugin)
        .use(remarkRehype)
        .use(rehypeSlug)
        .use(rehypeHighlight)
        .use(rehypeStringify);

    // 2. The process method is now static.
    // It uses `this.processor` which refers to the static property.
    public static async process(content: string): Promise<TProcessedMarkdown> {
        const result = await this.processor.process(content);

        return {
            html: String(result),
            toc: result.data.toc as TTocItem[],
        };
    }
}

// class ArticleRepository {
//     private processor = new MarkdownProcessor();

//     async create(title: string, content: string): Promise<Article> {
//         const { html, toc } = await this.processor.process(content);

//         const result = await db.query<Article>(
//             `INSERT INTO articles (title, content, html, toc, created_at)
//        VALUES ($1, $2, $3, $4, NOW())
//        RETURNING *`,
//             [title, content, html, JSON.stringify(toc)]
//         );

//         return {
//             ...result.rows[0],
//             toc: JSON.parse(result.rows[0].toc as unknown as string),
//         };
//     }

//     async findById(id: number): Promise<Article | null> {
//         const result = await db.query<Article>(
//             'SELECT * FROM articles WHERE id = $1',
//             [id]
//         );

//         if (result.rows.length === 0) return null;

//         return {
//             ...result.rows[0],
//             toc: JSON.parse(result.rows[0].toc as unknown as string),
//         };
//     }

//     async update(id: number, content: string): Promise<Article> {
//         const { html, toc } = await this.processor.process(content);

//         const result = await db.query<Article>(
//             `UPDATE articles
//                 SET content = $1, html = $2, toc = $3
//                 WHERE id = $4
//                 RETURNING *`,
//             [content, html, JSON.stringify(toc), id]
//         );

//         return {
//             ...result.rows[0],
//             toc: JSON.parse(result.rows[0].toc as unknown as string),
//         };
//     }
// }

function buildNestedToc(items: TTocItem[]): TNestedTocItem[] {
    const root: TNestedTocItem[] = [];
    const stack: TNestedTocItem[] = [];

    for (const item of items) {
        const node: TNestedTocItem = { ...item, children: [] };

        while (
            stack.length > 0 &&
            stack[stack.length - 1]!.depth >= item.depth
        ) {
            stack.pop();
        }

        if (stack.length === 0) {
            root.push(node);
        } else {
            stack[stack.length - 1]!.children.push(node);
        }

        stack.push(node);
    }

    return root;
}

// 사용
// const flatToc = await processMarkdownFile('article.md');
// const nestedToc = buildNestedToc(flatToc.toc);
