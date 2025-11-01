import Image from 'next/image';
import { TPost } from '@/apis/getPosts.api';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

type PostCardProps = {
    image: string;
} & TPost;

export function PostCard({ id, title, content, image }: PostCardProps) {
    return (
        <Card className="flex items-start gap-4 p-4 transition hover:bg-secondary">
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-zinc-800">
                <Image
                    src={image}
                    alt={title ?? 'post image'}
                    fill
                    sizes="80px"
                    className="object-cover"
                    loading="lazy"
                    quality={75}
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMjcyNzI3Ii8+PC9zdmc+"
                />
            </div>

            <div className="min-w-0 flex-1">
                <CardHeader className="p-0">
                    <CardTitle className="mb-1 truncate text-base font-bold md:text-lg">
                        {title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <p className="mb-2 line-clamp-2 text-sm text-foreground">
                        {content}
                    </p>
                </CardContent>
                <CardFooter className="flex gap-3 p-0">
                    <span className="text-xs font-semibold text-blue-400 transition hover:text-blue-300">
                        Read more
                    </span>

                    <button
                        type="button"
                        className="text-xs text-zinc-500 transition hover:text-zinc-300"
                    >
                        Share
                    </button>
                </CardFooter>
            </div>
        </Card>
    );
}
