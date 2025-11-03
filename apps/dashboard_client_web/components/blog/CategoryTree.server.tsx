// components/CategoryTree.tsx
'use client';

import { ChevronRight, Folder, File } from 'lucide-react';
import Link from 'next/link';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuBadge,
} from '@/components/ui/sidebar';
import { TreeNode } from '@/utils/tree.utils';

type CategoryTreeProps = {
    node: TreeNode;
    username: string;
};

export function CategoryTree({ node, username }: CategoryTreeProps) {
    const hasChildren = node.children.length > 0;

    if (!hasChildren) {
        return (
            <SidebarMenuItem>
                <Link href={`/blog/@${username}/category/${node.id}`}>
                    <SidebarMenuButton>
                        <File />
                        <span>{node.name}</span>
                    </SidebarMenuButton>
                </Link>
                {node.postCount > 0 && (
                    <SidebarMenuBadge>{node.postCount}</SidebarMenuBadge>
                )}
            </SidebarMenuItem>
        );
    }

    return (
        <SidebarMenuItem>
            <Collapsible
                className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
                defaultOpen={node.level === 0}
            >
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                        <ChevronRight className="transition-transform" />
                        <Folder />
                        <span>{node.name}</span>
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                {node.postCount > 0 && (
                    <SidebarMenuBadge>{node.postCount}</SidebarMenuBadge>
                )}
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {node.children.map((child) => (
                            <CategoryTree
                                key={child.id}
                                node={child}
                                username={username}
                            />
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </Collapsible>
        </SidebarMenuItem>
    );
}
