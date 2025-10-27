import axios from '@repo/axios';

type Props = {
    params: { slugs?: string[] };
};

const Page = async ({ params }: Props) => {
    const { username, slug } = (await params) as any; // undefined인 경우 빈 배열 처리
    const decodedUsername = decodeURIComponent(username).substring(1);
    console.log('username:', decodedUsername, 'slug:', slug);

    if (!slug) {
        return <div>잘못된 접근입니다. (No slug provided)</div>;
    }

    // Fetch post data from API using axios instance
    let post: any = null;
    let error = null;
    try {
        const res = await axios.get(`/v1/api/posts/slug/${slug}`);
        console.log(res);
        post = res.data;
    } catch (e: any) {
        error =
            e?.response?.data?.message || e.message || 'Error fetching post';
    }

    if (error) {
        return <div>포스트를 불러올 수 없습니다: {error}</div>;
    }
    if (!post) {
        return <div>포스트가 존재하지 않습니다.</div>;
    }

    return (
        <div className="prose max-w-2xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
            <div className="text-gray-500 text-sm mb-2">
                작성자: {post.user_id}
            </div>
            {/* Optionally render markdown content here, for now just raw */}
            <div>{post.content}</div>
        </div>
    );
};

export default Page;
