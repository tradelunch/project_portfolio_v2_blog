import clsx from 'clsx';

// app/blog/@[username]/page.tsx
import { PostList } from './PostList.server';

type PageProps = {
    params: Promise<{ username: string }>;
};

export default async function BlogPage({ params }: PageProps) {
    const { username } = await params;
    const decodedUsername = decodeURIComponent(username).substring(1); // Assuming it starts with '@'

    return (
        <main className="container mx-auto max-w-3xl px-4 py-8">
            <h1 className="mb-6 text-3xl font-bold">
                @{decodedUsername}'s Blog
            </h1>

            <PostList username={decodedUsername} />
        </main>
    );
}
