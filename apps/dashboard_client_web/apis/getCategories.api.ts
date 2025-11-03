// apis/getCategories.api.ts
import { axios_instance } from '@repo/axios';

export type TCategory = {
    id: number;
    name: string;
    parent_id: number;
    root_id: number;
    level: number;
    post_count: number;
};

export type TCategoriesResponse = {
    success: boolean;
    categories: TCategory[];
};

export async function getCategoriesByUsername(
    username: string
): Promise<TCategoriesResponse> {
    try {
        const response = await axios_instance.get<TCategoriesResponse>(
            `/v1/api/posts/users/${username}/categories`
        );

        console.log('categoriesL ', response.data);

        return response.data;
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        throw new Error('Failed to fetch categories');
    }
}
