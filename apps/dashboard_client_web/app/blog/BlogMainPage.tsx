'use client';

import React, { useState } from 'react';
import { ScrollToTopButton } from '@/app/ScrollToTop';

import {
    ETreeNodeType,
    FeaturedPost,
    RecentPost,
    TTreeNode,
    TTreeNodeWithChildren,
} from '@/app/blog/blog.types';
import { CategorySidebar } from '@/app/blog/CategorySidebar';
import { FeaturedPostsCarousel } from '@/app/blog/FeaturedPostCardCarousal';
import { RecentPostsList } from '@/app/blog/RecentPostsList';
import { buildCategoryTree } from '@/app/blog/CategoryTree.clinet';

// ============================================================================
// BlogMainPage Component (Example Usage)
// ============================================================================

export const BlogMainPage = () => {
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
