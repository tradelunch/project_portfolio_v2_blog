import axios from '@repo/axios';

import { getTranslations } from 'next-intl/server';

import clsx from 'clsx';
import { MarkdownRenderer } from '@/components/blog/MarkdownRenderer.server';
import PostContent from '@/components/blog/PostContent.server';

type Props = {
    params: Promise<{
        slug: string;
        username: string;
    }>;
};

export default async function BlogDetailPage({ params }: Props) {
    const { slug, username } = await params;

    const decodedUsername = decodeURIComponent(username ?? '').substring(1);
    console.log('username:', decodedUsername, slug);

    return (
        <div
            className={clsx(
                'blog-username-slug',
                'p-5 w-full max-w-lg xl:max-w-2xl mx-auto',
                'text-sm',
                'bg-background',
                'border border-primary rounded-lg'
            )}
        >
            <PostContent slug={slug} />

            <div className="text-gray-500 text-sm mb-2">
                작성자: {decodedUsername}
            </div>
        </div>
    );
}
