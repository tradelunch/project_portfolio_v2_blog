import { Suspense } from 'react';

import { RecentPostsList } from '@/app/blog/RecentPostsList.server';

import { FeaturedPost, RecentPost } from '@/apis/blog.types';
import { getBlogPostsByUsername } from '@/apis/getPosts.api';
import { loadMorePosts } from '@/app/actions/post.action';

// ============================================================================
// BlogMainPage Component (Example Usage)
// ============================================================================

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

interface Props {}

export const BlogMainPage: React.FC<Props> = async () => {
    return (
        <section className="relative w-full">
            <Suspense fallback={<div>Recent Posts Loading...</div>}>
                <RecentPostsList />
            </Suspense>
        </section>
    );
};

export default BlogMainPage;
