import { RecentPost } from '@/app/blog/blog.types';
import { RecentPostCard } from '@/app/blog/RecentPostCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// ============================================================================
// RecentPostsList Component
// ============================================================================

interface RecentPostsListProps {
    posts: RecentPost[];
}

export const RecentPostsList: React.FC<RecentPostsListProps> = ({ posts }) => {
    return (
        <Card className="bg-card border-primary">
            <CardHeader className="p-3 sm:p-6">
                <CardTitle className="text-primary text-sm sm:text-base">
                    &gt; RECENT_POSTS.log
                </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0 space-y-3 sm:space-y-4">
                {posts.map((post, idx) => (
                    <RecentPostCard
                        key={idx}
                        post={post}
                    />
                ))}

                <div className="text-center py-6 sm:py-8 text-muted-foreground">
                    <p className="text-xs sm:text-sm font-mono">
                        <span className="animate-pulse">▋</span> No more posts
                    </p>
                    <p className="text-xs mt-2">End of feed</p>
                </div>
            </CardContent>
        </Card>
    );
};
