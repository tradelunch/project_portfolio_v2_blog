'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollToTopButton } from '@/app/ScrollToTop';

// ============================================================================
// Types
// ============================================================================
export enum ETreeNodeType {
    CATEGORY = 'category',
    POST = 'post',
}

export interface TCategoryTreeNode {
    type: ETreeNodeType.CATEGORY;
    id: number;
    title: string;
    parent_id: number | null;
    level: number;
    group_id: number | null;
    priority: number;
    post_id: null;
    slug: null;
    description: null;
    created_at: null;
    updated_at: null;
    sort_key: string;
}

export interface TPostTreeNode {
    type: ETreeNodeType.POST;
    id: number;
    title: string;
    parent_id: number;
    level: number;
    group_id: null;
    priority: number;
    post_id: number;
    slug: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    sort_key: string;
}

export type TTreeNode = TCategoryTreeNode | TPostTreeNode;

export type TTreeNodeWithChildren = TTreeNode & {
    children?: TTreeNodeWithChildren[];
    postCount?: number;
};

// ============================================================================
// Utils - Build Tree from Flat Data
// ============================================================================
export function buildCategoryTree(
    flatData: TTreeNode[]
): TTreeNodeWithChildren[] {
    if (!flatData.length) return [];

    const nodeMap = new Map<number, TTreeNodeWithChildren>();

    // Initialize all nodes
    flatData.forEach((node) => {
        nodeMap.set(node.id, {
            ...node,
            children: [],
            postCount: 0,
        });
    });

    const rootNodes: TTreeNodeWithChildren[] = [];

    // Build tree and count posts
    flatData.forEach((node) => {
        const treeNode = nodeMap.get(node.id)!;

        if (!node.parent_id || node.parent_id === node.id) {
            rootNodes.push(treeNode);
        } else {
            const parent = nodeMap.get(node.parent_id);
            if (parent) {
                parent.children!.push(treeNode);
            } else {
                rootNodes.push(treeNode);
            }
        }
    });

    // Calculate post counts recursively
    function calculatePostCount(node: TTreeNodeWithChildren): number {
        if (node.type === ETreeNodeType.POST) {
            return 1;
        }

        let count = 0;
        if (node.children) {
            node.children.forEach((child) => {
                count += calculatePostCount(child);
            });
        }
        node.postCount = count;
        return count;
    }

    rootNodes.forEach(calculatePostCount);

    return rootNodes;
}

// ============================================================================
// CategoryTree Component
// ============================================================================
interface CategoryTreeProps {
    nodes: TTreeNodeWithChildren[];
    level?: number;
    selectedNode: number | null;
    onSelectNode: (id: number, node: TTreeNodeWithChildren) => void;
}

export const CategoryTree: React.FC<CategoryTreeProps> = ({
    nodes,
    level = 0,
    selectedNode,
    onSelectNode,
}) => {
    const [localExpanded, setLocalExpanded] = useState<Record<number, boolean>>(
        {}
    );

    const toggleExpand = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setLocalExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div
            className={`space-y-1 ${level > 0 ? 'ml-4 border-l-2 border-primary/30 pl-2' : ''}`}
        >
            {nodes.map((node) => {
                const isExpanded = localExpanded[node.id];
                const hasChildren = node.children && node.children.length > 0;
                const isPost = node.type === ETreeNodeType.POST;

                return (
                    <div key={node.id}>
                        <button
                            onClick={(e) => {
                                if (hasChildren) {
                                    toggleExpand(node.id, e);
                                }
                                onSelectNode(node.id, node);
                            }}
                            className={`w-full flex items-center gap-2 px-2 py-2 text-sm hover:bg-secondary transition-colors ${
                                selectedNode === node.id
                                    ? 'bg-primary/20 text-primary'
                                    : ''
                            }`}
                        >
                            {hasChildren && (
                                <span className="text-xs w-4">
                                    {isExpanded ? '▼' : '▶'}
                                </span>
                            )}
                            {!hasChildren && (
                                <span className="w-4">
                                    {isPost ? '📄' : ''}
                                </span>
                            )}
                            <span className="flex-1 text-left font-mono break-all">
                                {node.title}
                            </span>
                            {!isPost && node.postCount !== undefined && (
                                <Badge
                                    variant="outline"
                                    className="text-xs flex-shrink-0"
                                >
                                    {node.postCount}
                                </Badge>
                            )}
                        </button>
                        {hasChildren && isExpanded && (
                            <CategoryTree
                                nodes={node.children!}
                                level={level + 1}
                                selectedNode={selectedNode}
                                onSelectNode={onSelectNode}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

// ============================================================================
// FeaturedPostCard Component
// ============================================================================
interface FeaturedPost {
    title: string;
    author: string;
    views: number;
    comments?: number;
    reposts?: number;
    category: string;
    date: string;
}

interface FeaturedPostCardProps {
    post: FeaturedPost;
}

export const FeaturedPostCard: React.FC<FeaturedPostCardProps> = ({ post }) => {
    return (
        <Card className="bg-secondary border-primary/30 hover:border-primary transition-colors cursor-pointer group h-full">
            <div className="aspect-video bg-muted relative overflow-hidden border-b border-primary/30">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary flex items-center justify-center">
                    <div className="text-center p-4">
                        <div className="text-4xl sm:text-5xl mb-2">📄</div>
                        <div className="text-xs text-muted-foreground line-clamp-2 px-2">
                            {post.title}
                        </div>
                    </div>
                </div>
            </div>
            <CardContent className="p-3 sm:p-4">
                <Badge
                    variant="outline"
                    className="mb-2 text-xs"
                >
                    {post.category}
                </Badge>
                <h3 className="font-bold text-xs sm:text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors min-h-[2.5rem]">
                    {post.title}
                </h3>
                <p className="text-xs text-muted-foreground mb-2 truncate">
                    {post.author}
                </p>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-muted-foreground">
                    <span>👁 {post.views}</span>
                    {post.comments && <span>💬 {post.comments}</span>}
                    {post.reposts && <span>🔄 {post.reposts}</span>}
                </div>
            </CardContent>
        </Card>
    );
};

// ============================================================================
// FeaturedPostsCarousel Component
// ============================================================================
interface FeaturedPostsCarouselProps {
    posts: FeaturedPost[];
}

export const FeaturedPostsCarousel: React.FC<FeaturedPostsCarouselProps> = ({
    posts,
}) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);

    const scrollToSlide = (index: number) => {
        if (carouselRef.current) {
            const slideWidth = carouselRef.current.offsetWidth;
            carouselRef.current.scrollTo({
                left: slideWidth * index,
                behavior: 'smooth',
            });
            setCurrentSlide(index);
        }
    };

    const nextSlide = () => {
        const next = (currentSlide + 1) % posts.length;
        scrollToSlide(next);
    };

    const prevSlide = () => {
        const prev = (currentSlide - 1 + posts.length) % posts.length;
        scrollToSlide(prev);
    };

    return (
        <Card className="bg-card border-primary">
            <CardHeader className="p-3 sm:p-6">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-primary text-sm sm:text-base">
                        &gt; FEATURED_POSTS
                    </CardTitle>
                    <div className="flex gap-2">
                        <button
                            onClick={prevSlide}
                            className="w-8 h-8 border border-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                            aria-label="Previous"
                        >
                            ‹
                        </button>
                        <button
                            onClick={nextSlide}
                            className="w-8 h-8 border border-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                            aria-label="Next"
                        >
                            ›
                        </button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
                <div className="relative overflow-hidden">
                    <div
                        ref={carouselRef}
                        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4"
                        style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                        }}
                    >
                        {posts.map((post, idx) => (
                            <div
                                key={idx}
                                className="flex-shrink-0 w-full sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)] snap-start"
                            >
                                <FeaturedPostCard post={post} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-center gap-2 mt-4">
                    {posts.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => scrollToSlide(idx)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                                currentSlide === idx
                                    ? 'bg-primary'
                                    : 'bg-primary/30'
                            }`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            </CardContent>

            <style
                jsx
                global
            >{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </Card>
    );
};

// ============================================================================
// RecentPostCard Component
// ============================================================================
interface RecentPost {
    title: string;
    description: string;
    category: string;
    date: string;
    readTime: string;
}

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

// ============================================================================
// CategorySidebar Component
// ============================================================================
interface CategorySidebarProps {
    nodes: TTreeNodeWithChildren[];
    selectedNode: number | null;
    onSelectNode: (id: number, node: TTreeNodeWithChildren) => void;
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
    nodes,
    selectedNode,
    onSelectNode,
}) => {
    return (
        <Card className="bg-card border-primary lg:sticky lg:top-4">
            <CardHeader className="p-3 sm:p-6">
                <CardTitle className="text-primary flex items-center gap-2 text-sm sm:text-base">
                    <span>&gt;</span> CATEGORIES
                </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
                <CategoryTree
                    nodes={nodes}
                    selectedNode={selectedNode}
                    onSelectNode={onSelectNode}
                />
            </CardContent>
        </Card>
    );
};

// ============================================================================
// BlogMainPage Component (Example Usage)
// ============================================================================
const BlogMainPage = () => {
    const [selectedNode, setSelectedNode] = useState<number | null>(null);

    // Example flat data structure
    const flatCategoryData: TTreeNode[] = [
        {
            type: ETreeNodeType.CATEGORY,
            id: 641357054497263616,
            parent_id: null,
            group_id: 641357054497263616,
            level: 0,
            priority: 100,
            title: 'java',
            post_id: null,
            slug: null,
            description: null,
            created_at: null,
            updated_at: null,
            sort_key: '1',
        },
        {
            type: ETreeNodeType.CATEGORY,
            id: 641357054530818048,
            parent_id: 641357054497263616,
            group_id: 641357054497263616,
            level: 1,
            priority: 100,
            title: 'spring',
            post_id: null,
            slug: null,
            description: null,
            created_at: null,
            updated_at: null,
            sort_key: '2',
        },
        {
            type: ETreeNodeType.CATEGORY,
            id: 641357054539206656,
            parent_id: 641357054530818048,
            group_id: 641357054497263616,
            level: 2,
            priority: 100,
            title: 'jdbc',
            post_id: null,
            slug: null,
            description: null,
            created_at: null,
            updated_at: null,
            sort_key: '3',
        },
        {
            type: ETreeNodeType.POST,
            id: 641357050873384960,
            parent_id: 641357054539206656,
            group_id: null,
            level: 3,
            priority: 100,
            title: 'java spring jdbc',
            post_id: 641357050873384960,
            slug: 'java-spring-jdbc',
            description: null,
            created_at: '2025-11-06T01:23:56.765Z',
            updated_at: '2025-11-06T01:23:56.765Z',
            sort_key: '4',
        },
    ];

    const categoryTree = buildCategoryTree(flatCategoryData);

    const handleNodeSelect = (id: number, node: TTreeNodeWithChildren) => {
        setSelectedNode(id);
        console.log('Selected node:', node);
        // Handle navigation for posts
        if (node.type === ETreeNodeType.POST && node.slug) {
            // router.push(`/blog/${node.slug}`);
        }
    };

    const featuredPosts: FeaturedPost[] = [
        {
            title: 'Executing code on the whiteboard',
            author: 'Hiring For Tech',
            views: 109,
            reposts: 2,
            category: 'algorithm',
            date: '2025-01-15',
        },
        {
            title: 'Master your interview by practicing the React Interview Questions',
            author: 'Mohit Singh',
            views: 19,
            comments: 1,
            category: 'react',
            date: '2025-01-14',
        },
        {
            title: 'The Magic of Scripted Adversity & the Power of Visualization!',
            author: 'Dilip Saraf',
            views: 11,
            category: 'career',
            date: '2025-01-13',
        },
        {
            title: 'Building Scalable Microservices with Spring Boot',
            author: 'Tech Lead',
            views: 87,
            comments: 5,
            category: 'java/spring',
            date: '2025-01-12',
        },
        {
            title: 'Docker Best Practices for Production',
            author: 'DevOps Engineer',
            views: 156,
            reposts: 8,
            category: 'devops/docker',
            date: '2025-01-11',
        },
    ];

    const recentPosts: RecentPost[] = [
        {
            title: 'java spring jdbc',
            description:
                '# java spring jdbc Deep dive into JDBC template and connection pooling strategies for optimal performance.',
            category: 'java/spring/jdbc',
            date: '2025-01-10',
            readTime: '5 min',
        },
        {
            title: 'Understanding React Hooks',
            description:
                'Deep dive into useState, useEffect, and custom hooks for better component design.',
            category: 'javascript/react',
            date: '2025-01-08',
            readTime: '8 min',
        },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground font-mono">
            <div className="container mx-auto p-2 sm:p-4 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
                    <aside className="lg:col-span-1 order-1 lg:order-1">
                        <CategorySidebar
                            nodes={categoryTree}
                            selectedNode={selectedNode}
                            onSelectNode={handleNodeSelect}
                        />
                    </aside>

                    <main className="lg:col-span-3 space-y-4 md:space-y-6 order-2 lg:order-2">
                        <FeaturedPostsCarousel posts={featuredPosts} />
                        <RecentPostsList posts={recentPosts} />
                    </main>
                </div>
            </div>

            <ScrollToTopButton />
        </div>
    );
};

export default BlogMainPage;
