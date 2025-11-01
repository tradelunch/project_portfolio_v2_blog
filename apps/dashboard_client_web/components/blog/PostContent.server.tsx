import { getPostBySlug } from '@/apis/getPost.api';
import { MarkdownRenderer } from '@/components/blog/MarkdownRenderer.server';

export const PostContent = async ({ slug }: { slug: string }) => {
    const data = await getPostBySlug({ slug });

    // const res = await axios.get(`/v1/api/posts/slug/java-spring-jdbc`);
    // const res: any = await new Promise((resolve) => {
    //     setTimeout(() => {
    //         resolve({ data: { content: 'hello' } });
    //     }, 1000);
    // });
    // throw Error('error');

    return <MarkdownRenderer content={data.content || ''} />;
};

export default PostContent;
