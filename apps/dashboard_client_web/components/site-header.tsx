'use client';
import { Command, SidebarIcon } from 'lucide-react';

import { SearchForm } from '@/components/search-form';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useSidebar } from '@/components/ui/sidebar';

export function SiteHeader() {
    const { toggleSidebar } = useSidebar();

    return (
        <header className="flex h-12 shrink-0 items-center gap-2 border-b">
            <div className="flex h-[--header-height] w-full items-center gap-2 px-4">
                <Button
                    className="h-8 w-8"
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebar}
                >
                    <SidebarIcon />
                </Button>

                <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-3"
                />

                <Breadcrumb className="hidden sm:block">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="#">
                                Building Your Application
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <SearchForm className="w-full sm:ml-auto sm:w-auto" />
                <p className="text-muted-foreground text-sm">
                    Press{' '}
                    <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
                        <span className="flex aspect-square size-4 items-center justify-center rounded-xs">
                            <Command className="size-3" />
                            {' K'}
                        </span>
                    </kbd>
                </p>
            </div>
        </header>
    );
}
