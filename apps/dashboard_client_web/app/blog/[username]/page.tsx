import BlogMainPage from '@/app/blog/BlogMainPage';

type PageProps = {
    params: Promise<{ username: string }>;
};

export default async function BlogPage({ params }: PageProps) {
    return <BlogMainPage />;
}
