import clsx from 'clsx';

import Link from 'next/link';
import { axios_instance } from '@repo/axios';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { PostCard } from '@/components/blog/ArticleCard';

type Post = {
    id: number;
    title: string;
    content: string;
    stored_uri: string | null;
    slug: string;
};

const CDN_ASSET_POSTS = 'https://posts.prettylog.com';

export default async function Page({ params }: any) {
    return <>BLOG Main</>;
}
