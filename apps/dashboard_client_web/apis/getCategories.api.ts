// apis/getCategories.api.ts
import { TTreeNode } from '@/apis/blog.types';
import { axios_instance } from '@repo/axios';
import { ETreeNodeType } from '@repo/markdown-parsing';

export type TCategory = {
    id: number;
    title: string;
    slug: string;
    parent_id: number;
    root_id: number;
    level: number;
    post_count: number;
    type: ETreeNodeType;
};

export type TCategoriesResponse = {
    success: boolean;
    categories: TTreeNode[];
};

export async function getCategoriesByUsername(
    username: string
): Promise<TCategoriesResponse> {
    try {
        const res = await axios_instance.get<TCategoriesResponse>(
            `/v1/api/posts/users/${username}/categories`
        );

        console.log('categoriesL ', res.data);

        return res.data;
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        throw new Error('Failed to fetch categories');
    }
}
