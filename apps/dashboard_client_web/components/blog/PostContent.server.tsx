import { getPostBySlug } from '@/apis/getPost.api';
import { PostContentHeader } from '@/app/blog/PostContentHeader.server';
import { MarkdownRenderer } from '@/components/blog/MarkdownRenderer.server';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export const PostContent = async ({ slug }: { slug: string }) => {
    const post = await getPostBySlug({ slug });

    // const res = await axios.get(`/v1/api/posts/slug/java-spring-jdbc`);
    // const res: any = await new Promise((resolve) => {
    //     setTimeout(() => {
    //         resolve({ data: { content: 'hello' } });
    //     }, 1000);
    // });
    // throw Error('error');

    return (
        <>
            <Card
                className={cn(
                    // 'max-w-2xl',
                    'bg-card border-primary transition-all group',
                    'text-sm'
                    // 'hover:shadow-primary hover:shadow-xs hover:border-primary hover:bg-secondary'
                )}
            >
                <CardHeader className={cn('p-3 pb-0 sm:p-4 sm:pb-0')}>
                    <PostContentHeader
                        post={post}
                        hasBack={true}
                    />
                </CardHeader>

                <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0">
                    <MarkdownRenderer content={post.content || ''} />
                </CardContent>
            </Card>
        </>
    );
};

export default PostContent;
