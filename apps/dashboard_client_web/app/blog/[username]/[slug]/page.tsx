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
                'prose md:max-w-2xl p-5',
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
