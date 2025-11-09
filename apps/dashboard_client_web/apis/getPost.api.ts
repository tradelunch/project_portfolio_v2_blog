import { axios_instance } from '@repo/axios';

export const getPostBySlug = async ({ slug }: { slug: string }) => {
    const res = await axios_instance.get(`/v1/api/posts/slug/${slug}`);

    // const res = await new Promise<any>((resolve) => {
    //     setTimeout(() => resolve({ data: {} }), 3000);
    // });

    return res.data;
};
