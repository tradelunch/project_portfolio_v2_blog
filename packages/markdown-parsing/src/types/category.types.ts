// import { ETreeNodeType } from '../markdown';

export enum ETreeNodeType {
    CATEGORY = 'category',
    POST = 'post',
}

// import { ETreeNodeType } from '../markdown/constants';
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
    content: null;
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
    content: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    sort_key: string;
}

export type TTreeNode = TCategoryTreeNode | TPostTreeNode;

export interface TCategoryTreeResponse {
    success: boolean;
    data: {
        categories: TTreeNode[];
    };
}

export type TTreeNodeWithChildren = (TCategoryTreeNode | TPostTreeNode) & {
    children?: TTreeNodeWithChildren[];
};
