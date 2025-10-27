type Props = {
    params: { slugs?: string[] };
};

const Page = async ({ params }: Props) => {
    const { username, slug } = (await params) as any; // undefined인 경우 빈 배열 처리
    const decodedUsername = decodeURIComponent(username).substring(1);

    // call api to get user info
    // http get /api/users/{decodedUsername}
    // const user = await getUser(decodedUsername);
    // console.log('user:', user);
    // if user not found, return 404 page

    return (
        <div>
            <div>username: {decodedUsername}</div>
            <div>slug: {JSON.stringify(slug)}</div>
        </div>
    );
};

export default Page;
