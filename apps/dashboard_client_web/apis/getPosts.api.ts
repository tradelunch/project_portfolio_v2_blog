import axios from '@repo/axios';

export const getBlogPosts = async ({ slug }: { slug: string }) => {
    const res = await axios.get(`/v1/api/posts/slug/${slug}`);

    return res.data;
};
