import { TPost } from '@/apis/blog.types';
import { MoveBack } from '@/app/blog/MoveBack';
import { format } from 'date-fns';
import Link from 'next/link';
import React from 'react';

type Props = {
    post: TPost;
    hasBack?: boolean;
};

export const PostContentHeader: React.FC<Props> = ({
    post,
    hasBack = false,
}) => {
    const username = post.username ?? 'TAEKLIM';

    return (
        <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
            {hasBack && <MoveBack />}

            <span className="flex items-center gap-1">
                <span className="text-primary">👤</span>
                <Link href={`/blog/@${username}`}>
                    <span>{username.toLocaleUpperCase()}</span>
                </Link>
            </span>

            <span>•</span>

            <span>{post.date && format(post.date, 'yyyy-MM-dd')}</span>
        </div>
    );
};
