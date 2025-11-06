import * as React from 'react';

import { Sidebar, SidebarContent, SidebarRail } from '@/components/ui/sidebar';
import { CategoriesGroup } from '@/components/blog/sidebar-categories.server';
import Loading from '@/app/blog/[username]/loading';
import { BlogSidebarheader } from '@/components/blog/sidebar-header.server';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar {...props}>
            {/* <BlogSidebarheader /> */}

            <SidebarContent>
                <React.Suspense fallback={<Loading />}>
                    <CategoriesGroup />
                </React.Suspense>
            </SidebarContent>

            <SidebarRail />
        </Sidebar>
    );
}
