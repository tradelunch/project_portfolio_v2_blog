import { RecentPost } from '@/app/blog/blog.types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// ============================================================================
// RecentPostCard Component
// ============================================================================

interface RecentPostCardProps {
    post: RecentPost;
}

export const RecentPostCard: React.FC<RecentPostCardProps> = ({ post }) => {
    return (
        <Card className="bg-secondary border-primary/30 hover:border-primary transition-all cursor-pointer group">
            <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0 w-full">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            <Badge
                                variant="outline"
                                className="text-xs truncate max-w-full"
                            >
                                {post.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {post.date}
                            </span>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                                • {post.readTime}
                            </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-3 break-words">
                            {post.description}
                        </p>
                        <button className="text-xs sm:text-sm text-primary hover:underline">
                            Read more →
                        </button>
                    </div>
                    <div className="w-full sm:w-20 h-20 sm:h-20 bg-muted border border-primary/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">📝</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
