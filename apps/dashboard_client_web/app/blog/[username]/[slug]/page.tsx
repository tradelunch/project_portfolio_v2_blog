import axios from '@repo/axios';

import ReactMarkdown, { Components } from 'react-markdown';

// remark plugins (operate on Markdown syntax)
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import remarkMath from 'remark-math';

// rehype
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeKatex from 'rehype-katex';
import rehypePrismPlus from 'rehype-prism-plus';

import { getTranslations } from 'next-intl/server';

// styles
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';

import clsx from 'clsx';

const remarkPlugins = [
    remarkGfm, // tables, strikethrough, autolinks
    remarkBreaks, // treat line breaks as <br>
    remarkMath, // support $...$ and $$...$$ math
];

const rehypePlugins: any = [
    rehypeRaw,
    rehypeSlug,
    [rehypeAutolinkHeadings, { behavior: 'wrap' }],
    rehypeKatex,
    // [rehypePrismPlus, { showLineNumbers: true }], // syntax highlighting
];

const remarkComponents: any = {
    h1: ({ node, ...props }: any) => (
        <h1
            className="text-3xl font-semibold my-4  pb-2 text-primary"
            {...props}
        />
    ),
    h2: ({ node, ...props }: any) => (
        <h2
            className="text-2xl font-semibold my-3"
            {...props}
        />
    ),
    h3: ({ node, ...props }: any) => (
        <h3
            className="text-xl font-semibold my-2"
            {...props}
        />
    ),
    p: ({ node, ...props }: any) => (
        <p
            className="my-2 leading-relaxed text-gray-800 dark:text-gray-200"
            {...props}
        />
    ),
    pre: ({ node, ...props }: any) => (
        <pre
            className="rounded-lg my-3 overflow-x-auto bg-[#282c34] text-gray-100 p-4"
            {...props}
        />
    ),
    code({ inline, className, children, ...props }: any) {
        const match = /language-(\w+)/.exec(className || '');
        return !inline && match ? (
            <SyntaxHighlighter
                style={oneDark}
                language={match[1]}
                PreTag="div"
                {...props}
            >
                {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
        ) : (
            <code
                className="bg-gray-800 text-gray-100 px-1 py-0.5 rounded"
                {...props}
            >
                {children}
            </code>
        );
    },
    a: ({ node, ...props }: any) => (
        <a
            className="text-primary hover:underline hover:text-destructive"
            // target="_blank"
            rel="noopener noreferrer"
            {...props}
        />
    ),
    ul: ({ node, ...props }: any) => (
        <ul
            className="list-disc ml-6 mb-3"
            {...props}
        />
    ),
    ol: ({ node, ...props }: any) => (
        <ol
            className="list-decimal ml-6 mb-3"
            {...props}
        />
    ),
    blockquote: ({ node, ...props }: any) => (
        <blockquote
            className="border-l-4 border-gray-400 pl-4 italic text-gray-600"
            {...props}
        />
    ),
};

const MarkdownRenderer = ({ content }: { content: string }) => {
    return (
        <ReactMarkdown
            remarkPlugins={remarkPlugins}
            rehypePlugins={rehypePlugins}
            components={remarkComponents}
        >
            {content || ''}
        </ReactMarkdown>
    );
};

type Props = {
    params: { slugs?: string[] };
};

const Page = async ({ params }: Props) => {
    const { username, slug } = (await params) as any; // undefined인 경우 빈 배열 처리
    const decodedUsername = decodeURIComponent(username).substring(1);

    const t = await getTranslations('common');

    console.log('username:', decodedUsername, 'slug:', slug);
    console.log('ping:', t('ping'));

    if (!slug) {
        return <div>잘못된 접근입니다. (No slug provided)</div>;
    }

    // Fetch post data from API using axios instance
    let post: any = null;
    let error = null;

    try {
        const res = await axios.get(`/v1/api/posts/slug/${slug}`);
        post = res.data;
    } catch (e: any) {
        error =
            e?.response?.data?.message || e.message || 'Error fetching post';
    }

    if (error) {
        return <div>포스트를 불러올 수 없습니다: {error}</div>;
    }

    if (!post) {
        return <div>포스트가 존재하지 않습니다.</div>;
    }

    return (
        <div
            className={clsx(
                'prose max-w-2xl mx-auto p-4',
                'text-sm',
                'bg-secondary',
                'border border-primary rounded-lg'
            )}
        >
            <MarkdownRenderer content={post.content || ''} />

            <div className="text-gray-500 text-sm mb-2">
                작성자: {decodedUsername}
            </div>
        </div>
    );
};
export default Page;
