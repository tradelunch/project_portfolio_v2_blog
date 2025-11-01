import { visit } from 'unist-util-visit';

import type { Root } from 'mdast';
import type { VFile } from 'vfile';

import type { TTocItem, TNestedTocItem } from '@/types/markdown.types';

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

export function buildNestedToc(items: TTocItem[]): TNestedTocItem[] {
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
