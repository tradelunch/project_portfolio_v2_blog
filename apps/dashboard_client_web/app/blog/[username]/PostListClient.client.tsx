// components/PostListClient.tsx
'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import Link from 'next/link';

import { TPost } from '@/apis/getPosts.api';
import { loadMorePosts } from '@/app/actions/post.action';
import { PostCard } from '@/components/blog/ArticleCard';

type PostListClientProps = {
    username: string;
    initialPosts: TPost[];
    initialCursor: number | null;
    initialHasMore: boolean;
    cdnURL: string;
};

export function PostListClient({
    username,
    initialPosts,
    initialCursor,
    initialHasMore,
    cdnURL,
}: PostListClientProps) {
    const [posts, setPosts] = useState<TPost[]>(initialPosts);
    const [cursor, setCursor] = useState<number | null>(initialCursor);
    const [hasMore, setHasMore] = useState(initialHasMore);
    const [isPending, startTransition] = useTransition();

    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!hasMore || isPending) return;

        observerRef.current = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting && cursor !== null) {
                    startTransition(async () => {
                        const data = await loadMorePosts(username, cursor);

                        setPosts((prev) => [...prev, ...data.posts]);
                        setCursor(data.nextCursor);
                        setHasMore(data.hasMore);
                    });
                }
            },
            { rootMargin: '200px' }
        );

        const currentRef = loadMoreRef.current;
        if (currentRef) observerRef.current.observe(currentRef);

        return () => {
            if (observerRef.current && currentRef) {
                observerRef.current.unobserve(currentRef);
            }
        };
    }, [cursor, hasMore, isPending, username]);

    return (
        <>
            <div className="flex flex-col gap-4">
                {posts.map((post) => {
                    const imageUrl = `${cdnURL}/${post.stored_uri}`;
                    return (
                        <Link
                            key={`${post.id}-${post.slug}`}
                            href={`/blog/@${username}/${post.slug}`}
                        >
                            <PostCard
                                {...post}
                                image={imageUrl}
                            />
                        </Link>
                    );
                })}
            </div>

            {hasMore && (
                <div
                    ref={loadMoreRef}
                    className="flex justify-center py-8"
                >
                    {isPending && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            Loading more posts...
                        </div>
                    )}
                </div>
            )}

            {!hasMore && posts.length > 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">
                    No more posts
                </p>
            )}
        </>
    );
}
