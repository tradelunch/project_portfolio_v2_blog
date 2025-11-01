// components/PostList.tsx
import { getBlogPostsByUsername } from '@/apis/getPosts.api';
import { PostListClient } from '@/app/blog/[username]/PostListClient.client';
import { CDN_ASSET_POSTS } from '@/env.schema';

type PostListProps = {
    username: string;
};

export async function PostList({ username }: PostListProps) {
    const { posts, nextCursor, hasMore } = await getBlogPostsByUsername(
        username,
        0,
        10
    );

    if (posts.length === 0) {
        return (
            <p className="text-center text-muted-foreground">
                No articles found.
            </p>
        );
    }

    return (
        <PostListClient
            username={username}
            initialPosts={posts}
            initialCursor={nextCursor}
            initialHasMore={hasMore}
            cdnURL={CDN_ASSET_POSTS}
        />
    );
}
