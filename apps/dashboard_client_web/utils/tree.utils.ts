// lib/tree.utils.ts
import { TCategory } from '@/apis/getCategories.api';

export type TreeNode = {
    id: number;
    name: string;
    level: number;
    postCount: number;
    children: TreeNode[];
    href: string;
};

/**
 * Converts flat category list to hierarchical tree structure
 */
export function buildCategoryTree(categories: TCategory[]): TreeNode[] {
    if (!categories.length) return [];

    // Create a map for quick lookup
    const categoryMap = new Map<number, TreeNode>();

    // Initialize all nodes
    categories.forEach((cat) => {
        categoryMap.set(cat.id, {
            id: cat.id,
            name: cat.name,
            level: cat.level,
            postCount: cat.post_count,
            children: [],
            href: `/category/${cat.id}`,
        });
    });

    const rootNodes: TreeNode[] = [];

    // Build the tree
    categories.forEach((cat) => {
        const node = categoryMap.get(cat.id)!;

        if (cat.parent_id === 0 || cat.parent_id === cat.id) {
            // Root node
            rootNodes.push(node);
        } else {
            // Child node
            const parent = categoryMap.get(cat.parent_id);
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
