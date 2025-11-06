// ============================================================================
// Types
// ============================================================================
export enum ETreeNodeType {
    CATEGORY = 'category',
    POST = 'post',
}

// import { ETreeNodeType } from '@repo/markdown-parsing';

export interface TCategoryTreeNode {
    type: ETreeNodeType.CATEGORY;
    id: number;
    title: string;
    parent_id: number | null;
    level: number;
    group_id: number | null;
    priority: number;
    post_id: null;
    slug: null;
    description: null;
    created_at: null;
    updated_at: null;
    sort_key: string;
}

export interface TPostTreeNode {
    type: ETreeNodeType.POST;
    id: number;
    title: string;
    parent_id: number;
    level: number;
    group_id: null;
    priority: number;
    post_id: number;
    slug: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    sort_key: string;
}

export type TTreeNode = TCategoryTreeNode | TPostTreeNode;

export type TTreeNodeWithChildren = TTreeNode & {
    children?: TTreeNodeWithChildren[];
    postCount?: number;
};

export interface FeaturedPost {
    title: string;
    author: string;
    views: number;
    comments?: number;
    reposts?: number;
    category: string;
    date: string;
}

export interface RecentPost {
    title: string;
    description: string;
    category: string;
    date: string;
    readTime: string;
}
