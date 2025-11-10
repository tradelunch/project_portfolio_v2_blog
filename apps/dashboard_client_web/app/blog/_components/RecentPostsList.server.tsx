import { loadMorePosts } from '@/app/actions/post.action';
import { RecentPostsListClient } from '@/app/blog/_components/RecentPostsList.client';
import { CDN_ASSET_POSTS } from '@/env.schema';

// ============================================================================
// RecentPostsList Component
// ============================================================================
interface RecentPostsListProps {
    // posts: RecentPost[];
    cdnBaseUrl?: string;
    onUpvote?: (postIndex: number) => void;
    onDownvote?: (postIndex: number) => void;
    onCommentClick?: (postIndex: number) => void;
    onShare?: (postIndex: number) => void;
    params?: Promise<{ username?: string }>;
}

export const RecentPostsList: React.FC<RecentPostsListProps> = async ({
    params,
    cdnBaseUrl = '',
    onUpvote,
    onDownvote,
    onCommentClick,
    onShare,
}) => {
    const { username = '@taeklim' } = (await params) || {};

    const decodedUsername = decodeURIComponent(username).substring(1); // Assuming it starts with '@'

    const { posts, nextCursor, hasMore } = await loadMorePosts(
        0,
        10,
        decodedUsername
    );

    if (posts.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm font-mono">
                    <span className="animate-pulse">▋</span> No articles found
                </p>
            </div>
        );
    }

    return (
        <RecentPostsListClient
            username={decodedUsername}
            initialPosts={posts}
            initialCursor={nextCursor}
            initialHasMore={hasMore}
            cdnURL={CDN_ASSET_POSTS}
        />
    );
};
