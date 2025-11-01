import { axios_instance } from '@repo/axios';

export const getPostBySlug = async ({ slug }: { slug: string }) => {
    const res = await axios_instance.get(`/v1/api/posts/slug/${slug}`);

    return res.data;
};
