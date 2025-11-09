import ReactMarkdown from 'react-markdown';

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

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';

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
            className="text-3xl font-semibold my-4 pb-2 text-primary"
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
        <div
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
            className="text-primary hover:underline hover:text-foreground/90"
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

export const MarkdownRenderer = ({ content }: { content: string }) => {
    return (
        <ReactMarkdown
            remarkPlugins={remarkPlugins}
            rehypePlugins={rehypePlugins}
            components={remarkComponents}
        >
            {content}
        </ReactMarkdown>
    );
};
