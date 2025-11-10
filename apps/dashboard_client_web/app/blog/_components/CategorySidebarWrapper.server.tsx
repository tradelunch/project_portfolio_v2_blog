// app/blog/CategorySidebarWrapper.server.tsx
import { TTreeNode } from '@/apis/blog.types';
import {
    getCategoriesByUsername,
    TCategoriesResponse,
} from '@/apis/getCategories.api';
import { CategoryErrorBoundary } from '@/app/blog/_components/CategoryErrorboundary.client';
import { CategorySidebar } from '@/app/blog/_components/CategorySidebar.client';

export const CategorySidebarWrapper = async () => {
    let data: TCategoriesResponse = await getCategoriesByUsername('taeklim');

    // try {
    //     const data = await getCategoriesByUsername('taeklim');
    //     categories = data.categories;
    // } catch (error) {
    //     console.error('Failed to load categories:', error);
    // }

    return <CategorySidebar categories={data.categories ?? []} />;
};
