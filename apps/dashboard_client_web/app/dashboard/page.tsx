import clsx from 'clsx';
import { ArticleCard } from '../../components/ArticleCard';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
} from '../../components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';

const mockArticles = [
    {
        id: 1,
        title: 'How to Build a Modern Dashboard',
        excerpt:
            'Learn how to create a beautiful, responsive dashboard using Next.js and Tailwind CSS.',
        image: '/images/blog/dashboard.jpg',
    },
    {
        id: 2,
        title: 'Understanding React Server Components',
        excerpt:
            'A deep dive into React Server Components and how they change the way we build web apps.',
        image: '/images/blog/server-components.jpg',
    },
    {
        id: 3,
        title: 'Styling with Tailwind CSS',
        excerpt:
            'Tips and tricks for using Tailwind CSS efficiently in your projects.',
        image: '/images/blog/tailwind.jpg',
    },
];

export default function Page() {
    return (
        <>
            <h1 className="text-xl font-medium mb-2">ARTICLES</h1>
            <section className={clsx('mb-6')}>
                <div className="flex flex-col gap-4">
                    {mockArticles.map((article) => (
                        <ArticleCard
                            key={article.id}
                            {...article}
                        />
                    ))}
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

                    <CarouselPrevious className={clsx('hidden', 'md:inline-flex')} />
                    <CarouselNext className={clsx('hidden', 'md:inline-flex')} />
                </Carousel>
            </section>
        </>
    );
}
