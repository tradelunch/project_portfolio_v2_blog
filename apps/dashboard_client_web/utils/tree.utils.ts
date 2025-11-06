// lib/tree.utils.ts
import { TCategory } from '@/apis/getCategories.api';
import { ETreeNodeType } from '@/app/blog/blog.types';

export type TreeNode = {
    id: number;
    name: string;
    slug: string;
    level: number;
    postCount: number;
    children: TreeNode[];
    href: string;
    type: ETreeNodeType;
};

/**
 * Converts flat category list to hierarchical tree structure
 */
export function buildCategoryTree(categories: TCategory[]): TreeNode[] {
    if (!categories.length) return [];

    // Create a map for quick lookup
    const categoryMap = new Map<number, TreeNode>();

    // Initialize all nodes
    categories.forEach((c) => {
        categoryMap.set(c.id, {
            id: c.id,
            name: c.title,
            slug: c.slug,
            level: c.level,
            postCount: c.post_count,
            children: [],
            // TODO click category?
            href: `/category/${c.title}`,
            // type: c.type
            type: c.type,
        });
    });

    const rootNodes: TreeNode[] = [];

    // Build the tree
    categories.forEach((c) => {
        const node = categoryMap.get(c.id)!;
        if (!c.parent_id || c.parent_id === c.id) {
            console.log('parent_id', c.parent_id);
            // Root node
            rootNodes.push(node);
        } else {
            // Child node
            const parent = categoryMap.get(c.parent_id);
            if (parent) {
                parent.children.push(node);
            } else {
                // Parent not found, treat as root
                rootNodes.push(node);
            }
        }
    });

    return rootNodes;
}

/**
 * Converts tree structure to sidebar format
 */
export function treeToSidebarFormat(nodes: TreeNode[]): any[] {
    return nodes.map((node) => {
        if (node.children.length === 0) {
            return node.name;
        }

        return [node.name, ...treeToSidebarFormat(node.children)];
    });
}
