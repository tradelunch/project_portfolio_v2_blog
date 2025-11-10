import { axios_instance } from '@repo/axios';

export const getPostBySlug = async ({ slug }: { slug: string }) => {
    try {
        const response = await axios_instance.get(`/v1/api/posts/slug/${slug}`);

        // const res = await new Promise<any>((resolve) => {
        //     setTimeout(() => resolve({ data: {} }), 3000);
        // });

        console.log(response);

        return response.data;
    } catch (error) {
        console.error('Failed to fetch posts:', error);
        throw new Error(`Failed to fetch a post: ${slug}`);
    }
};
