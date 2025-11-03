// components/CategorySidebar.tsx
import { getCategoriesByUsername } from '@/apis/getCategories.api';
import { CategoryTree } from '@/components/blog/CategoryTree.server';

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
} from '@/components/ui/sidebar';
import { buildCategoryTree } from '@/utils/tree.utils';

type CategorySidebarProps = {
    username: string;
};

export async function CategorySidebar({ username }: CategorySidebarProps) {
    const { categories } = await getCategoriesByUsername(username);
    const tree = buildCategoryTree(categories);

    if (tree.length === 0) {
        return null;
    }

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Categories</SidebarGroupLabel>

            <SidebarGroupContent>
                <SidebarMenu>
                    {tree.map((node: any) => (
                        <CategoryTree
                            key={node.id}
                            node={node}
                            username={username}
                        />
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
