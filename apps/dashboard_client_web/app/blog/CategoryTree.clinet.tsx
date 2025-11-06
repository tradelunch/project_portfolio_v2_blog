'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import {
    ETreeNodeType,
    TTreeNode,
    TTreeNodeWithChildren,
} from '@/app/blog/blog.types';

// ============================================================================
// Utils - Build Tree from Flat Data
// ============================================================================
export function buildCategoryTree(
    flatData: TTreeNode[]
): TTreeNodeWithChildren[] {
    if (!flatData.length) return [];

    const nodeMap = new Map<number, TTreeNodeWithChildren>();

    // Initialize all nodes
    flatData.forEach((node) => {
        nodeMap.set(node.id, {
            ...node,
            children: [],
            postCount: 0,
        });
    });

    const rootNodes: TTreeNodeWithChildren[] = [];

    // Build tree and count posts
    flatData.forEach((node) => {
        const treeNode = nodeMap.get(node.id)!;

        if (!node.parent_id || node.parent_id === node.id) {
            rootNodes.push(treeNode);
        } else {
            const parent = nodeMap.get(node.parent_id);
            if (parent) {
                parent.children!.push(treeNode);
            } else {
                rootNodes.push(treeNode);
            }
        }
    });

    // Calculate post counts recursively
    function calculatePostCount(node: TTreeNodeWithChildren): number {
        if (node.type === ETreeNodeType.POST) {
            return 1;
        }

        let count = 0;
        if (node.children) {
            node.children.forEach((child) => {
                count += calculatePostCount(child);
            });
        }
        node.postCount = count;
        return count;
    }

    rootNodes.forEach(calculatePostCount);

    return rootNodes;
}

// ============================================================================
// CategoryTree Component
// ============================================================================

interface CategoryTreeProps {
    nodes: TTreeNodeWithChildren[];
    level?: number;
    selectedNode: number | null;
    onSelectNode: (id: number, node: TTreeNodeWithChildren) => void;
}

export const CategoryTree: React.FC<CategoryTreeProps> = ({
    nodes,
    level = 0,
    selectedNode,
    onSelectNode,
}) => {
    const [localExpanded, setLocalExpanded] = useState<Record<number, boolean>>(
        {}
    );

    const toggleExpand = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setLocalExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div
            className={`space-y-1 ${level > 0 ? 'ml-4 border-l-2 border-primary/30 pl-2' : ''}`}
        >
            {nodes.map((node) => {
                const isExpanded = localExpanded[node.id];
                const hasChildren = node.children && node.children.length > 0;
                const isPost = node.type === ETreeNodeType.POST;

                return (
                    <div key={node.id}>
                        <button
                            onClick={(e) => {
                                if (hasChildren) {
                                    toggleExpand(node.id, e);
                                }
                                onSelectNode(node.id, node);
                            }}
                            className={`w-full flex items-center gap-2 px-2 py-2 text-sm hover:bg-secondary transition-colors ${
                                selectedNode === node.id
                                    ? 'bg-primary/20 text-primary'
                                    : ''
                            }`}
                        >
                            {hasChildren && (
                                <span className="text-xs w-4">
                                    {isExpanded ? '▼' : '▶'}
                                </span>
                            )}
                            {!hasChildren && (
                                <span className="w-4">
                                    {isPost ? '📄' : ''}
                                </span>
                            )}
                            <span className="flex-1 text-left font-mono break-all">
                                {node.title}
                            </span>
                            {!isPost && node.postCount !== undefined && (
                                <Badge
                                    variant="outline"
                                    className="text-xs flex-shrink-0"
                                >
                                    {node.postCount}
                                </Badge>
                            )}
                        </button>
                        {hasChildren && isExpanded && (
                            <CategoryTree
                                nodes={node.children!}
                                level={level + 1}
                                selectedNode={selectedNode}
                                onSelectNode={onSelectNode}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
};
