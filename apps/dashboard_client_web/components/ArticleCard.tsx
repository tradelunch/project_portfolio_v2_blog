import clsx from 'clsx';

interface ArticleCardProps {
    id: number;
    title: string;
    excerpt: string;
    image: string;
}

export function ArticleCard({ id, title, excerpt, image }: ArticleCardProps) {
    return (
        <article
            className={clsx(
                'flex items-start gap-4',
                'p-4',
                'bg-background border border-foreground',
                'hover:bg-secondary transition'
                // 'p-4 shadow hover:shadow-lg transition group'
            )}
        >
            <img
                src={image}
                alt={title}
                className="w-20 h-20 object-cover rounded-xl flex-shrink-0 border border-zinc-800"
            />

            <div className="flex-1 min-w-0">
                <h2 className="text-base md:text-lg font-bold mb-1 truncate">
                    {title}
                </h2>
                <p className="text-foreground text-sm mb-2 line-clamp-2">
                    {excerpt}
                </p>
                <div className="flex gap-3 items-center mt-2">
                    <a
                        href="#"
                        className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition"
                    >
                        Read more
                    </a>

                    <button className="text-xs text-zinc-500 hover:text-zinc-300 transition">
                        Share
                    </button>
                </div>
            </div>
        </article>
    );
}
