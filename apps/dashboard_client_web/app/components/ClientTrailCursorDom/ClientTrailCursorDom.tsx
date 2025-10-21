'use client';

import { useTrailingCursorDom } from '@/hooks/useTrailingCursor.hook';

import './ClientTrailCursorDom.scss';

type Props = {};

export const ClientTrailCursorDom = ({}: Props) => {
    useTrailingCursorDom();

    return undefined;
};

export default ClientTrailCursorDom;
