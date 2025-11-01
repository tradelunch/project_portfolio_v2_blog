import clsx from 'clsx';
import { ArticleCard } from '../../../components/ArticleCard';
import Link from 'next/link';
import axios from '@repo/axios';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
} from '../../../components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';

type Post = {
    id: number;
    title: string;
    content: string;
    stored_uri: string | null;
    slug: string;
};

const CDN_ASSET_POSTS = 'https://posts.prettylog.com';

export default async function Page({ params }: any) {
    const { username } = (await params) as any; // undefined인 경우 빈 배열 처리
    const decodedUsername = decodeURIComponent(username).substring(1);
    console.log('username:', decodedUsername);

    let posts: Post[] = [];
    let error: string | null = null;

    try {
        const response = await axios.get(
            `/v1/api/posts/user/${'darkowlrising'}`
        );
        posts = response.data;
    } catch (e: any) {
        console.error('Failed to fetch posts:', e);
        error =
            e?.response?.data?.message || e.message || 'Error fetching posts';
    }

    return (
        <>
            <h1 className="text-xl font-medium mb-2">ARTICLES</h1>
            <section className={clsx('mb-6')}>
                <div className="flex flex-col gap-4">
                    {error && <p>Error loading articles: {error}</p>}

                    {!error && posts.length === 0 && <p>No articles found.</p>}

                    {posts.map((article) => {
                        const imageUrl = `${CDN_ASSET_POSTS}/${article.stored_uri}`;

                        return (
                            <Link
                                key={article.id}
                                href={`/blog/@${decodedUsername}/${article.slug}`}
                            >
                                <ArticleCard
                                    id={article.id}
                                    title={article.title}
                                    excerpt={article.content}
                                    image={imageUrl}
                                />
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* More articles for you carousel */}
            <h2 className="text-xl font-medium mb-2">More articles for you</h2>
            <section className="px-0 md:px-16">
                <Carousel
                    opts={{
                        align: 'start',
                    }}
                    className="w-full"
                >
                    <CarouselContent>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <CarouselItem
                                key={index}
                                className="md:basis-1/2 lg:basis-1/3"
                            >
                                <div className="p-1">
                                    <Card>
                                        <CardContent className="flex aspect-square items-center justify-center p-6">
                                            <span className="text-3xl font-semibold">
                                                {index + 1}
                                            </span>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    <CarouselPrevious
                        className={clsx('hidden', 'md:inline-flex')}
                    />
                    <CarouselNext
                        className={clsx('hidden', 'md:inline-flex')}
                    />
                </Carousel>
            </section>
        </>
    );
}
