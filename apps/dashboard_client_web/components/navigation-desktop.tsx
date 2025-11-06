import { ModeToggle } from '@/components/mode-toggle';
import clsx from 'clsx';
import Link from 'next/link';
import React from 'react';

const LINKS = [
    {
        title: 'About',
        href: '/',
        description:
            'Find in-depth information about Turborepo features and API.',
    },
    {
        title: 'blog',
        href: '/blog/@taeklim',
        description: 'Technology blog',
    },
    {
        title: 'projects',
        href: '/projects',
        description:
            'Choose from over 15 examples and deploy with a single click.',
    },
    {
        title: 'resume',
        href: '/resume',
        description:
            'Instantly deploy your Turborepo to a shareable URL with Vercel.',
    },
];

type Props = {};

export const DesktopNavigation = ({}: Props) => {
    return (
        <nav
            className={clsx(
                'flex h-10 md:h-10 lg:h-12',
                'items-center justify-between'
            )}
        >
            <div className="flex-1 items-center max-w-full text-2xl">
                <Link href={'/'}>Taek Lim</Link>
            </div>
            <ul
                className={clsx('flex flex-row gap-2 items-center justify-end')}
            >
                {LINKS.map((link) => (
                    <li key={link.title}>
                        <Link href={link.href}>
                            {link.title.toLocaleUpperCase()}
                        </Link>
                    </li>
                ))}
                <li>
                    <ModeToggle />
                </li>
            </ul>
        </nav>
    );
};

export default DesktopNavigation;
