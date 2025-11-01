// app/actions/posts.action.ts
'use server';

import { getBlogPostsByUsername } from '@/apis/getPosts.api';

export async function loadMorePosts(username: string, cursor: number) {
    const data = await getBlogPostsByUsername(username, cursor, 10);
    return data;
}
