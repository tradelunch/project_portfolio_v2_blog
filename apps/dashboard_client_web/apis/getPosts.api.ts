// apis/getPosts.api.ts
import { axios_instance } from '@repo/axios'; // 경로는 프로젝트에 맞게 조정

export type TPost = {
    id: number;
    title: string;
    content: string;
    slug: string;
    stored_uri: string;
    created_at: string;
    updated_at: string;
    user_id: number;
};

export type TPaginatedResponse = {
    success: boolean;
    posts: TPost[];
    nextCursor: number | null;
    hasMore: boolean;
};

export async function getBlogPostsByUsername(
    username: string,
    cursor: number = 0,
    limit: number = 10
): Promise<TPaginatedResponse> {
    try {
        const response = await axios_instance.get<TPaginatedResponse>(
            `/v1/api/posts/users/${username}`,
            {
                params: { cursor, limit },
            }
        );

        return response.data;
    } catch (error) {
        console.error('Failed to fetch posts:', error);
        throw new Error('Failed to fetch posts');
    }
}
