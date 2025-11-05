import * as React from 'react';

import { ChevronRight, File, Folder } from 'lucide-react';

import {
    AudioWaveform,
    Blocks,
    Calendar,
    Command,
    Home,
    Inbox,
    MessageCircleQuestion,
    Search,
    Settings2,
    Sparkles,
    Trash2,
} from 'lucide-react';

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarRail,
} from '@/components/ui/sidebar';
import { TeamSwitcher } from '@/components/team-switcher';
import clsx from 'clsx';
import Link from 'next/link';
import { ModeToggle } from '@/components/mode-toggle';
import { CategoriesGroup } from '@/components/blog/sidebar-categories.server';
import Loading from '@/app/blog/[username]/loading';

// This is sample data.
const data = {
    teams: [
        {
            name: 'Acme Inc',
            logo: Command,
            plan: 'Enterprise',
        },
        {
            name: 'Acme Corp.',
            logo: AudioWaveform,
            plan: 'Startup',
        },
        {
            name: 'Evil Corp.',
            logo: Command,
            plan: 'Free',
        },
    ],
    headers: [
        {
            file: 'ABOUT',
            href: 'about',
            // state: 'M',
        },
        {
            file: 'BLOG',
            href: '',
            // state: 'M',
        },
        {
            file: 'PROJECTS',
            href: 'projects',

            // state: 'U',
        },
        {
            file: 'RESUME',
            href: 'resume',
            // state: 'M',
        },
    ],
    tree: [
        [
            'app',
            [
                'api',
                ['hello', ['route.ts']],
                ['blog', ['page.tsx']],
                'page.tsx',
                'layout.tsx',
            ],
        ],
        [
            'components',
            ['ui', 'button.tsx', 'card.tsx'],
            'header.tsx',
            'footer.tsx',
        ],
        ['lib', ['util.ts']],
        ['public', 'favicon.ico', 'vercel.svg'],
        '.eslintrc.json',
        '.gitignore',
        'next.config.js',
        'tailwind.config.js',
        'package.json',
        'README.md',
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const name = 'Taek Lim';
    const username = 'taeklim';

    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <div
                    className={clsx(
                        'flex justify-between align-middle',
                        'px-1.5'
                    )}
                >
                    <div className={clsx('flex gap-2')}>
                        <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                            <Link href="/">
                                <Command className="size-5" />
                            </Link>
                        </div>

                        <span className="truncate font-semibold text-2xl">
                            <Link href={`/blog/@${username}`}>{name}</Link>
                        </span>
                    </div>

                    <ModeToggle />
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>DASHBOARD</SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu>
                            {data.headers.map((item, index) => (
                                <SidebarMenuItem key={index}>
                                    <Link
                                        href={`/blog/@${username}/${item.href}`}
                                    >
                                        <SidebarMenuButton>
                                            <File />
                                            {item.file}
                                        </SidebarMenuButton>
                                    </Link>

                                    {/* <SidebarMenuBadge>
                                        {item.state}
                                    </SidebarMenuBadge> */}
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <React.Suspense fallback={<Loading />}>
                    <CategoriesGroup username={username} />
                </React.Suspense>

                {/* <SidebarGroup>
                    <SidebarGroupLabel>Files</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {data.tree.map((item, index) => (
                                <Tree
                                    key={index}
                                    item={item}
                                />
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup> */}
            </SidebarContent>

            <SidebarRail />
        </Sidebar>
    );
}

function Tree({ item }: { item: string | any[] }) {
    const [name, ...items] = Array.isArray(item) ? item : [item];
    // console.log('TREE ITEM:', item, name, items);

    if (!items.length) {
        return (
            <SidebarMenuButton
                isActive={name === 'button.tsx'}
                className="data-[active=true]:bg-transparent"
            >
                <File />
                {name}
            </SidebarMenuButton>
        );
    }

    return (
        <SidebarMenuItem>
            <Collapsible
                className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
                defaultOpen={name === 'components' || name === 'ui'}
            >
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                        <ChevronRight className="transition-transform" />
                        <Folder />
                        {name}
                    </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent>
                    <SidebarMenuSub>
                        {items.map((subItem, index) => (
                            <Tree
                                key={index}
                                item={subItem}
                            />
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </Collapsible>
        </SidebarMenuItem>
    );
}
