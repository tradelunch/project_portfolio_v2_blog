// components/CategorySidebar.tsx
import { getCategoriesByUsername } from '@/apis/getCategories.api';
import { buildCategoryTree } from '@/app/blog/_components/CategoryTree.client';
import { CategoryTree } from '@/components/blog/sidebar-category-tree.server';

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
} from '@/components/ui/sidebar';

type CategorySidebarProps = {};

export async function CategoriesGroup({}: CategorySidebarProps) {
    // TODO: dynamic username
    const username = 'taeklim';

    const { categories } = await getCategoriesByUsername(username);

    if (!categories) {
        return null;
    }

    const tree = buildCategoryTree(categories ?? []);

    return (
        <SidebarGroup>
            <SidebarGroupLabel>CATEGORIES</SidebarGroupLabel>

            <SidebarGroupContent>
                <SidebarMenu>
                    {tree.map((node: any) => {
                        console.log('node: ', node);

                        return (
                            <CategoryTree
                                key={node.id}
                                node={node}
                                username={username}
                            />
                        );
                    })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
