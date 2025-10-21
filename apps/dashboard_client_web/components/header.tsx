import clsx from 'clsx';
import Link from 'next/link';
import React from 'react';

type Props = {};

export default function Header({}: Props) {
    return (
        <nav className="sticky top-0 z-50 border-b-2 border-border bg-background">
            <div className="mx-auto max-w-[95vw] px-2">
                <div className="flex h-14 md:h-14 h-10 items-center justify-between">
                    <div className="flex-1 items-center max-w-full">
                        <Link href={'/'}>Taek Lim</Link>
                    </div>
                    <ul
                        className={clsx(
                            'flex flex-row gap-2 items-center justify-end'
                        )}
                    >
                        <li>
                            <Link href={'/'}>ABOUT</Link>
                        </li>
                        <li>
                            <Link href={'/dashboard'}>DASHBOARD</Link>
                        </li>
                        <li>
                            <Link href={'/projects'}>PROJECTS</Link>
                        </li>
                        <li>
                            <Link href={'/resume'}>RESUME</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
